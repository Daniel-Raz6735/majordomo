from queries.read_queries import ReadQueries as readQ
from queries.create_queries import CreateQueries as createQ
from fastapi import HTTPException


# def add_dummy():
#
#     res = load_dummy_data(tables_to_read, table_info.tables)
#     return select_connection(res, False)



def insert_to_table_query(table_name, cols, values):
    """creates a insert SQL query using the parameters
        input: table name: string with table name
                cols: list of column names.
                values: list of lists: [[col1 val,  col2 val,....],[...]]
        output: insert statement if legal parameters. None if not"""
    if not table_name or not cols or not values:
        return None, 400
    num_of_cols = len(cols)
    query = "INSERT INTO " + table_name + " ("
    for col in cols:
        query += col + ", "
    query = query[:-2]
    query += ") \nVALUES ("
    entered_loop = False
    for value in values:
        if len(value) != num_of_cols:
            continue
        for val in value:
            entered_loop = True
            if type(val) == str and "to_timestamp" not in val:
                query += "'" + val + "', "
            else:
                if not val and val != 0:
                    query += "null, "
                else:
                    query += str(val) + ", "
        query = query[:-2] + "),\n("
    query = query[:-3] + ";"
    if entered_loop:
        return query, 200
    else:
        return "Bad request", 400


def convert_val(val):
    if type(val) == str and "to_timestamp" not in val:
        return "'" + val + "' "
    else:
        if not val and val != 0:
            return " null "
        else:
            return str(val) + " "


def update_table_query(table_name, cols, values, conditions, include_t_name=True):
    """creates an update SQL query using the parameters
        input: table name: string with table name
                cols: [col1 name, col2 name,....]
                values:  [col1 val,  col2 val,....]
                conditions: [col name, operator ,value] (supports only and between conditions)
                include_t_name will be false for conflict update query which starts with Update SET
        output: update statement if legal parameters. None if not and a res code as well"""
    if not table_name or not cols or not values or not conditions:
        return None, 400
    if len(cols) != len(values):
        return "columns and values lengths are not equal", 400
    if include_t_name:
        query = "UPDATE " + table_name + " SET "
    else:
        query = "UPDATE SET "

    num_of_cols = len(cols)
    colon = ""
    for i in range(num_of_cols):  # col name = value
        col = cols[i]
        val = convert_val(values[i])
        if val:
            query += colon + col + " = " + val
            colon = ", "
    query += "\nWHERE "
    colon = ""
    for condition in conditions:
        val = convert_val(condition[2])
        if val:
            query += colon + table_name + "." + condition[0] + " " + condition[1] + " " + val
            colon = " AND "

    query += ";"
    return query, 200


def update_order_content_query(item_id, order_id, amount, unit, price_per_unit=None, include_t_name=True):
    """Creates an update order content query using the parameter
      input:item_id, order_id, amount, unit, price_per_unit-  int values representing the same name columns int the order_content table
        include_t_name: will be false for conflict update query which starts with Update SET """
    conditions = [["item_id", "=", item_id], ["order_id", "=", order_id]]
    cols_to_set = ["amount", "unit"]
    vals_to_set = [amount, unit]
    if price_per_unit:
        cols_to_set.append("price_per_unit")
        vals_to_set.append(price_per_unit)
    return update_table_query("order_content", cols_to_set, vals_to_set, conditions, include_t_name)


def add_empty_order(business_id, supplier_id):
    """Creates an SQL query for adding an empty order based on supplier_id and a business_id"""
    cols = ["business_id", "supplier_id"]
    vals = [[business_id, supplier_id]]
    query, res_code = insert_to_table_query("orders", cols, vals)
    if res_code != 200:
        print(query)
        raise HTTPException(status_code=500, detail="Server error")
    return query, res_code


class UpdateQueries:
    def __init__(self, connection):
        self.connection = connection
        self.reader = readQ(self.connection)
        self.creator = createQ(self.connection)

    def __del__(self):
        del self.connection

    def add_order_item(self, item_id, order_id, business_id, supplier_id, amount, unit):
        """this function gets order information and item information and confirms that:
        1.the supplier supplies the item id sent to the business_id sent.
        2.that the order id is an open order between the supplier and the business(if order_id is 0 than a new order_is opend)
        3.that the order ,business and supplier ids are correct
        then it will insert the item in to the order or update the amount and unit to the new values
        input: ids
        output: "success" message, res code, order_id"""

        # confirm supplier provides this item to client
        supply, res_code = self.get_supply(business_id, supplier_id, item_id)
        if len(supply) == 0:  # order does not exist
            raise HTTPException(status_code=404, detail="Supplier not found")

        # confirm that their is an order
        query, res_code = self.reader.get_order_by_supplier(business_id, supplier_id, True)
        order_info = self.execute_query(query, res_code)
        if len(order_info) == 0:  # order does not exist
            if order_id:
                raise HTTPException(status_code=404, detail="Incorrect order id")
            else:
                # add a new order
                res, res_code = self.add_order(business_id, supplier_id)
                if res_code != 200:
                    raise HTTPException(status_code=500, detail="Server error")
                # get the new orders order id
                query, res_code = self.reader.get_order_by_supplier(business_id, supplier_id, True)
                order_info = self.execute_query(query, res_code)
                if not order_info or len(order_info) == 0:  # order still does not exist
                    raise HTTPException(status_code=500, detail="Problem adding a new order")

        order_info = order_info[0]
        if order_info["order_id"] != order_id and order_id:
            raise HTTPException(status_code=404, detail="Wrong order id, try sending with id = 0")
        order_id = order_info["order_id"]

        if business_id != order_info["business_id"]:
            print("Business_id not identical to users business_id got: ", order_info["business_id"], "expected:",
                  business_id)
            raise HTTPException(status_code=403, detail="Accesses to order is forbidden")

        if supplier_id != order_info["supplier_id"]:
            print("Supplier_id not identical to users supplier_id got: ", order_info["supplier_id"], "expected:",
                  supplier_id)
            raise HTTPException(status_code=400, detail="Wrong supplier id sent")

        # add item to order
        insert_query, res_code = insert_to_table_query('order_content',
                                                       ['item_id', "order_id", "amount", "unit"],
                                                       [[item_id, order_id, amount, unit]])
        if res_code != 200:
            raise HTTPException(status_code=500, detail="Server error")
        update_query, res_code = update_order_content_query(item_id, order_id, amount, unit, None, None)
        print(update_query)
        if res_code != 200:
            raise HTTPException(status_code=500, detail="Server error")

        return self.connection.insert_data(insert_query, "Parameter error", update_query, ['item_id', "order_id"]), order_id

    def execute_query(self, query, res_code):
        """executes a query and return its result """
        if res_code != 200:  # if query failed
            print("Unable to create get query: ", query)
            raise HTTPException(status_code=500, detail="Server error")
        order_info, res_code = self.connection.get_result(query)
        return order_info

    def add_order(self, business_id, supplier_id):
        """Adds a new order entry"""

        query, res_code = add_empty_order(business_id, supplier_id)
        if res_code != 200:  # unable to get an add empty order query
            print(query)
            raise HTTPException(status_code=500, detail="Server error")

        res, res_code = self.connection.insert_data(query, "Failed to add order")
        if res_code != 200:
            raise HTTPException(status_code=res_code, detail="Error creating new order")
        return "Order added successfully", 200

    def get_supply(self, business_id, supplier_id, item_id):
        """get supply information"""
        query, res_code = self.reader.get_supplier(business_id, supplier_id, item_id)
        if res_code != 200:  # if query failed
            print("Unable to create get order query", query)
            raise HTTPException(status_code=500, detail="Server error")
        supply_info, res_code = self.connection.get_result(query)
        return supply_info, res_code
