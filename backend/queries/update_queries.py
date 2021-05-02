from queries.read_queries import ReadQueries as readQ
from queries.create_queries import CreateQueries as createQ
from queries.connection_manager import Connection
from fastapi import HTTPException
from pydantic import BaseModel, BaseSettings
import time


class UserInfo(BaseModel):
    user_id: int
    email_domain_name: str
    email_user_name: str
    address: str = None
    business_id: int = None
    department_id: int = None
    first_name: str = None
    last_name: str = None
    phone_number: int = None


def convert_val(val):
    """convert a value from an object to a string that can be inserted to an SQL query"""
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
        supply = self.get_supply(business_id, supplier_id, item_id)
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
        insert_query, res_code = self.insert_to_table_query('order_content',
                                                       ['item_id', "order_id", "amount", "unit"],
                                                       [[item_id, order_id, amount, unit]])
        if res_code != 200:
            raise HTTPException(status_code=500, detail="Server error")
        update_query, res_code = update_order_content_query(item_id, order_id, amount, unit, None, None)
        print(update_query)
        if res_code != 200:
            raise HTTPException(status_code=500, detail="Server error")

        res , res_code = self.connection.insert_data(insert_query, "Parameter error", update_query, ['item_id', "order_id"])

        return res, res_code, order_id

    def execute_query(self, query, res_code):
        """executes a query and return its result """
        if res_code != 200:  # if query failed
            print("Unable to create get query: ", query)
            raise HTTPException(status_code=500, detail="Server error")
        order_info = self.connection.get_result(query)
        return order_info

    def add_order(self, business_id, supplier_id):
        """Adds a new order entry"""
        query, res_code = self.add_empty_order(business_id, supplier_id)
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
        supply_info = self.connection.get_result(query)
        return supply_info

    def add_empty_order(self, business_id, supplier_id):
        """Creates an SQL query for adding an empty order based on supplier_id and a business_id"""
        cols = ["business_id", "supplier_id"]
        vals = [[business_id, supplier_id]]
        query, res_code = self.insert_to_table_query("orders", cols, vals)
        if res_code != 200:
            print(query)
            raise HTTPException(status_code=500, detail="Server error")
        return query, res_code


    @staticmethod
    def edit_user(info: UserInfo):
        info_dict = info.dict()
        conditions = []
        cols_to_set = []
        if info_dict["user_id"]:
            conditions.append([["user_id", "=", int(info_dict["user_id"])]])
        else:
            raise HTTPException(status_code=400, detail="No user id sent")
        if "email" in info_dict and info_dict["email"]:
            split_mail = info_dict["email"]
            if len(split_mail) != 2:
                cols_to_set.append("email_domain_name")



#         address: "vegetables place, JLM"
# business_id: null
# department_id: null
# email_domain_name: "gmail.com"
# email_user_name: "vegetables"
# first_name: "vegetable"
# last_name: "seller"
# phone_number: "502001231"
#         cols_to_set = ["amount", "unit"]
#         vals_to_set = [amount, unit]
#         if price_per_unit:
#             cols_to_set.append("price_per_unit")
#             vals_to_set.append(price_per_unit)
#         return update_table_query("users ", cols_to_set, vals_to_set, conditions, include_t_name)


    def add_notification(self, business_id, item_id, notification_level, message=None, remove_only=False):
        """remove all previous notifications and if not remove_only add a notification to the data """
        remove_query = self.remove_active_notifications_query(business_id, item_id)
        add_query = self.add_notification_query(business_id, item_id, notification_level, message)
        self.connection.execute_query(remove_query, "Unable to remove notifications")
        if not remove_only:
            self.connection.execute_query(add_query, "Unable to add new notifications")

    @staticmethod
    def disable_container_query(container_id, business_id=None):
        """set all instances of a container to have using_en_date to be set when this function is called"""
        if not container_id:
            raise HTTPException(status_code=400, detail="bad container id")
        conditions = [["container_id", "=", int(container_id)]]
        if business_id:
            conditions.append(["business_id", "=", int(business_id)])
        cols_to_set = ["using_end_date"]
        vals_to_set = ["to_timestamp("+str(int(time.time()))+")"]
        query, res_code = update_table_query("containers", cols_to_set, vals_to_set, conditions)
        return query

    def add_container_to_business_query(self, business_id, container_id=None, item_id=None):
        """Creates an SQL query for adding a container to a business and connect it to an item provided item_id"""
        val = [int(business_id)]
        cols = ["business_id"]

        if container_id is not None:
            cols.append("container_id")
            val.append(int(container_id))
        if item_id is not None:
            cols.append("item_id")
            val.append(int(item_id))

        vals = [val]
        query, res_code = self.insert_to_table_query("containers", cols, vals)
        if res_code != 200:
            print(query)
            raise HTTPException(status_code=500, detail="Server error")
        return query

    def add_notification_query(self, business_id, item_id, notification_level, message=None, worker_level=1):
        """Creates an SQL query for adding a new notification"""
        cols = ["date_created", "business_id", "food_item_id", "code", "active", "notification_worker_level"]
        val = ["to_timestamp("+str(int(time.time()))+")", business_id, item_id, notification_level, True, worker_level]
        if message is not None:
            cols.append("message")
            val.append(message)
        vals = [val]
        query, res_code = self.insert_to_table_query("notifications", cols, vals)
        if res_code != 200:
            print(query)
            raise HTTPException(status_code=500, detail="Server error")
        return query

    @staticmethod
    def remove_active_notifications_query(business_id, item_id, notification_level=None):
        """set all previous notifications active to false """
        cols = ["active"]
        vals = [False]
        conditions = [["business_id", "=", int(business_id)], ["food_item_id", "=", int(item_id)]]
        if notification_level is not None:
            conditions.append(["code", "=", int(notification_level)])
        query, res_code = update_table_query("notifications", cols, vals, conditions)
        if res_code != 200:
            print(query)
            raise HTTPException(status_code=500, detail="Server error")
        return query

    @staticmethod
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
