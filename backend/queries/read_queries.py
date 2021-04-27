from fastapi import HTTPException
from psycopg2.extras import RealDictCursor
from config import config
from db_queries import DbQueries
from queries.connection_manager import Connection
import psycopg2


class ReadQueries:
    def __init__(self, connection=False):
        if not connection:
            connection = Connection()
        self.connection = connection

    @staticmethod
    def get_rules_query(business_id=None):
        """method for getting the rules by business id
            parameters received: required: business_id, optional: active, rule_id
            output:[["rule_id", "item_id", "content_minimum_per_day", "content_maximum_per_day",
                "content_total_minimum", "content_total_maximum", "active"]....]"""

        conditions = []
        if business_id:
            conditions.append(["AND", "food_items.business_id", "=", int(business_id)])

        final_query, res_code = DbQueries.select_query(
            ["food_items"],
            [[["item_id"], ["business_id"], ["content_minimum_per_day"], ["content_maximum_per_day"],
              ["content_total_minimum"], ["content_total_maximum"], ["item_average_weight"]]],
            conditions)
        if res_code != 200:
            raise HTTPException(status_code=res_code, detail=final_query)
        return final_query

    @staticmethod
    def get_order(order_id):
        """creates an SQL query that will return a specific order based on the id"""
        conditions = []
        if order_id:
            conditions.append(["AND", "orders.order_id", "=", int(order_id)])
        else:
            raise HTTPException(status_code=400, detail="No order id sent")
        final_query, res_code = DbQueries.select_query([["orders"]], [], conditions)
        if res_code != 200:
            raise HTTPException(status_code=res_code, detail=final_query)
        return final_query, 200

    @staticmethod
    def get_item(item_id, business_id=None):
        """creates an SQL query that will return a food_item"""
        conditions = []
        if item_id:
            conditions.append(["AND", "item_id", "=", int(item_id)])
        else:
            raise HTTPException(status_code=400, detail="No item id sent")
        if business_id is not None:
            conditions.append(["AND", "business_id", "=", int(business_id)])
        final_query, res_code = DbQueries.select_query([["food_items"]], [], conditions)
        if res_code != 200:
            raise HTTPException(status_code=res_code, detail=final_query)
        return final_query

    @staticmethod
    def get_container_item_id_query(business_id, container_id, using_end_date=None):
        """creates an SQL query that will return a containers item id"""
        conditions = []
        if business_id:
            conditions.append(["AND", "containers.business_id", "=", int(business_id)])
        else:
            raise HTTPException(status_code=400, detail="No business id sent")
        if business_id:
            conditions.append(["AND", "containers.container_id", "=", int(container_id)])
        else:
            raise HTTPException(status_code=400, detail="No business id sent")
        if using_end_date:
            conditions.append(["AND", "containers.using_end_date", "=", "to timestamp(" + using_end_date + ")"])
        else:
            conditions.append(["AND", "containers.using_end_date", "is", "null"])

        final_query, res_code = DbQueries.select_query([["containers"]], [[["item_id"]]], conditions)
        if res_code != 200:
            raise HTTPException(status_code=res_code, detail=final_query)
        return final_query

    @staticmethod
    def get_order_by_supplier(business_id, supplier_id, open_orders=False):
        """creates an sql query that gets a specific order by supplier.
        open orders is in case the request is only open orders(orders with no date)"""
        conditions = []
        if supplier_id:
            conditions.append(["AND", "orders.supplier_id", "=", int(supplier_id)])
        else:
            return error_message(400, "Bad request", "no supplier id sent"), 400
        if business_id:
            conditions.append(["AND", "orders.business_id", "=", int(business_id)])
        else:
            return error_message(400, "Bad request", "no business id sent"), 400
        if open_orders:
            conditions.append(["AND", "orders.order_date", " is ", 'null'])

        final_query, res_code = DbQueries.select_query([["orders"]], [], conditions)
        if res_code != 200:
            return error_message(res_code, final_query), 400
        return final_query, 200

    @staticmethod
    def get_item_from_order(item_id, order_id):
        """creates an sql query that gets a specific item from an order"""
        conditions = []
        if order_id:
            conditions.append(["AND", "order_content.order_id", "=", int(order_id)])
        else:
            raise HTTPException(status_code=400, detail="No order_id id sent")
        if item_id:
            conditions.append(["AND", "order_content.item_id", "=", int(item_id)])
        else:
            raise HTTPException(status_code=400, detail="No item id sent")

        conditions.append(["AND", "order_content.order_id", "=", "orders.order_id"])
        final_query, res_code = DbQueries.select_query([["orders"], ["order_content"]],
                                                       [[], [["item_id"], ["order_id"], ["price_per_unit"], ["amount"],
                                                             ["unit"]]],
                                                       conditions)
        if res_code != 200:
            raise HTTPException(status_code=400, detail=final_query)
        return final_query, 200

    @staticmethod
    def get_supplier(business_id, supplier_id, item_id):
        """Create a supplier sql query based on the item_id, business_id and supplier_id"""
        conditions = []
        if item_id:
            conditions.append(["AND", "supplier.item_id", "=", int(item_id)])
        else:
            return "No order id sent", 400
        if supplier_id:
            conditions.append(["AND", "supplier.supplier_id", "=", int(supplier_id)])
        else:
            return "No supplier id sent", 400
        if business_id:
            conditions.append(["AND", "supplier.business_id", "=", int(business_id)])
        else:
            return "No business id sent", 400
        final_query, res_code = DbQueries.select_query([["supplier"]],
                                                       [],
                                                       conditions)
        if res_code != 200:
            return "Unable to create query", 400
        return final_query, 200

    @staticmethod
    def get_notifications(business_id=None, active=True, notification_id=None):
        """method for getting the active notifications by business id
            output:[["code", "message", "item_id", "active", "closed_by_user"]]"""
        conditions = []
        if business_id:
            conditions.append(["AND", "notifications.business_id", "=", int(business_id)])

        if active:
            conditions.append(["AND", "notifications.active", "=", active])
        if notification_id:
            conditions.append(["AND", "notifications.notification_id", "=", int(notification_id)])

        final_query, res_code = DbQueries.select_query(
            [["notifications"]],
            [[["code"], ["business_id"], ["message"], ["food_item_id", "item_id"], ["active"], ["closed_by_user"]]],
            conditions)
        return final_query

    @staticmethod
    def get_notifications_with_info(business_id=None, active=True, notification_id=None):
        """this function creates a full notification information kit query
             a notification kit includes the active notifications and the
            parameters received: required: business_id,
            optional: active, notification_id
            output:[["code", "message", "item_id", "active", "closed_by_user"]]"""
        conditions = []
        if business_id:
            conditions.append(["AND", "notifications.business_id", "=", int(business_id)])
        if active:
            conditions.append(["AND", "notifications.active", "=", active])
        if notification_id:
            conditions.append(["AND", "notifications.notification_id", "=", int(notification_id)])
        conditions.append(["AND", "notifications.food_item_id", "=", "food.item_id"])
        conditions.append(["AND", "food.category_id", "=", "cat.category_id"])
        sub_table = ReadQueries.get_current_weight_query(business_id)
        sub_table = sub_table[:-1]
        conditions.append(["AND", "sub.item_id", "=", "food.item_id"])

        final_query, res_code = DbQueries.select_query(
            [["notifications"], ["food_items", "food"], ["categories", "cat"], ["(" + sub_table + ")", "sub"]],
            [[["code"], ["message"], ["food_item_id", "item_id"], ["active"], ["closed_by_user"]],
             [["item_name"], ["unit"]],
             [["category_id"], ["category_name"]],
             [["date"], ["item_name"], ["weight"]]
             ],
            conditions)
        if res_code != 200:
            return error_message(res_code, final_query), 400
        return final_query, 200

    @staticmethod
    def get_current_weight_query(business_id=None, container_ids=None, item_ids=None, get_by_container=False):
        """gets an SQL query of the last weight of all items.
        optional parameters:
        business_id: will specify which business you want to request
        container_ids: int or list of ints specifying which container we want
        item_ids: int specifying which item we want
        get by container: boolean determines if to give the results by container or by item """
        conditions = []
        if business_id:
            conditions.append(["AND", "containers.business_id", "=", int(business_id)])

        if container_ids:
            and_or = "AND"
            if type(container_ids) == list:
                for container_id in container_ids:
                    conditions.append([and_or, "containers.container_id", "=", int(container_id)])
                    and_or = "OR"
            else:
                conditions.append(["AND", "containers.container_id", "=", int(container_ids)])
        if item_ids:
            and_or = "AND"
            for item in item_ids:
                conditions.append([and_or, "containers.item_id", "=", int(item)])
                and_or = "OR"
        conditions.append(["AND", "weights.container_id", "=", "containers.container_id"])
        max_table, res_code = DbQueries.select_query(["containers", "weights"],
                                                     [[["container_id"]], [["weighing_date", "date", "MAX"]]],
                                                     conditions)
        max_table = max_table[:-1]
        conditions.append(["AND", "food_items.item_id", "=", "containers.item_id"])
        conditions.append(["AND", "t1.date", "=", "weights.weighing_date"])
        conditions.append(["AND", "t1.container_id", "=", "containers.container_id"])
        conditions.append(["AND", "food_items.category_id", "=", "categories.category_id"])
        if get_by_container:
            cols_to_bring = [[["container_id"], ["business_id"]],
                             [["weight_value", "weight"], ["weighing_date", "date"]],
                             [["item_name"], ["item_id"], ["unit"]],
                             [["category_name"], ["category_id"]],
                             []]
        else:
            cols_to_bring = [[[]],
                             [["weight_value", "weight", "SUM"], ["weighing_date", "date", "MAX"]],
                             [["item_name"], ["item_id"], ["unit"]],
                             [["category_name"], ["category_id"]],
                             []]

        final_query, res_code = DbQueries.select_query(
            ["containers", "weights", "food_items", "categories", ["(" + max_table + ")", "t1"]],
            cols_to_bring,
            conditions)
        if res_code != 200:
            raise HTTPException(status_code=400, detail=final_query)
        return final_query

    @staticmethod
    def get_weight_history(item_id, business_id, min_date, max_date):
        """creates an items weight history query
           input: business_id, item_id - ids
           max,min dates -  Unix Timestamp - represents the time window for the history"""
        conditions = []
        if business_id:
            conditions.append(["AND", "weights.business_id", "=", int(business_id)])
        else:
            raise HTTPException(status_code=400, detail="No business id sent")
        if item_id:
            conditions.append(["AND", "weights.item_id", "=", int(item_id)])
        else:
            raise HTTPException(status_code=400, detail="No item id sent")
        if min_date is not None:
            conditions.append(["AND", "weights.weighing_date", ">=", "to_timestamp(" + str(min_date) + ")"])
        if max_date is not None:
            conditions.append(["AND", "weights.weighing_date", "<=", "to_timestamp(" + str(max_date) + ")"])

        cols_to_bring = [[["weight_value", "weight", "SUM"], ["weighing_date", "date"], ["item_id"]]]

        query, res_code = DbQueries.select_query(["weights"], cols_to_bring, conditions)
        if res_code != 200:
            raise HTTPException(status_code=500, detail="Error creating weight query")
        return query, 200

    @staticmethod
    def get_container_by_id_query(container_id):
        """get a query with container information """
        conditions = []
        if container_id:
            conditions.append(["AND", "container_id", "=", int(container_id)])
        else:
            raise HTTPException(status_code=400, detail="No container id sent")

        cols_to_bring = []

        query, res_code = DbQueries.select_query(["containers"], cols_to_bring, conditions)
        if res_code != 200:
            raise HTTPException(status_code=500, detail="Error creating container query")
        return query

    @staticmethod
    def get_new_container():
        """gets the last added container (container ids are auto incremented)"""
        conditions = [["AND", "item_id", "is", "null"]]
        cols_to_bring = [[["container_id", "container_id", "MAX"]]]
        query, res_code = DbQueries.select_query(["containers"], cols_to_bring, conditions)
        if res_code != 200:
            raise HTTPException(status_code=500, detail="Error getting new item")
        return query

    @staticmethod
    def get_suppliers_query(business_id, items_ids=None):
        """create an SQL query that will return all of the suppliers that sell to a business and the items that they supply.
          provided item id list it will return the items requested"""
        conditions = []
        if business_id:
            conditions.append(["AND", "supplier.business_id", "=", int(business_id)])
        else:
            raise HTTPException(status_code=400, detail="no business id sent")

        if items_ids:
            and_or = "AND"
            for item in items_ids:
                conditions.append([and_or, "supplier.item_id", "=", int(item)])
                and_or = "OR"

        conditions.append(["AND", "supplier.supplier_id", "=", "users.user_id"])

        final_query, res_code = DbQueries.select_query(
            ["supplier", "users"],
            None,
            conditions)
        if res_code != 200:
            raise HTTPException(status_code=res_code, detail=final_query)
        return final_query

    @staticmethod
    def get_open_orders_query(business_id, order_ids=None):
        """create an SQL query that will get all opened orders information  for a specific business.
        provided order id list it will return only the open orders requested"""
        conditions = []
        if business_id:
            conditions.append(["AND", "orders.business_id", "=", int(business_id)])
        else:
            return error_message(400, "Bad request", "no business id sent"), 400

        if order_ids:
            and_or = "AND"
            for order in order_ids:
                conditions.append([and_or, "orders.order_id", "=", int(order)])
                and_or = "OR"

        conditions.append(["AND", "orders.order_id", "=", "content.order_id"])
        conditions.append(["AND", "orders.order_date", "is", "null"])

        final_query, res_code = DbQueries.select_query(
            ["orders", ["order_content", "content"]],
            None,
            conditions)
        if res_code != 200:
            return error_message(res_code, final_query), 400
        return final_query, 200

    @staticmethod
    def get_user_preferences_query(user_email):
        """creates an SQL query that will return the user preferences"""
        column_list = [[["user_id"], ["lang"], ["minimum_reach_alerts"], ["freshness_alerts"]], []]
        conditions = []
        if user_email:
            if ";" in user_email:
                raise HTTPException(status_code=400, detail="request not allowed")
            email = user_email.split("@")
            if len(email) != 2:
                raise HTTPException(status_code=400, detail="Invalid email")
            conditions.append(["AND", "users.email_user_name", "=", "'" + email[0] + "'"])
            conditions.append(["AND", "users.email_domain_name", "=", "'" + email[1] + "'"])
            conditions.append(["AND", "users.user_id", "=", "user_preference.user_id"])
        else:
            raise HTTPException(status_code=400, detail=" user email not sent")

        final_query, res_code = DbQueries.select_query(["user_preference", "users"],
                                                       column_list,
                                                       conditions)
        if res_code != 200:
            raise HTTPException(status_code=res_code, detail=final_query)
        return final_query

    @staticmethod
    def select_connection(query, expecting_result=True):
        """this function connects with the DB and executes the query sent from the user. the result will be one of the following:
        if there is a return value: returned Sql value as a list, 200
        if not expecting result is needed it will return "processed OK", 200
        if there is a problem with query: error message, 400.
        if there is problem with the result: error message, 500
        """
        conn = None
        rows = "Result not found"
        results = []
        try:
            # read connection parameters
            params = config()

            # connect to the PostgreSQL server
            print('Connecting to the PostgreSQL database...')
            conn = psycopg2.connect(**params, cursor_factory=RealDictCursor)

            # create a cursor
            cur = conn.cursor()
            print("executing query: ")
            print(query, "\n")
            if type(query) == list:
                res = {}
                for q in query:
                    cur.execute(q[0])
                    rows = dictionify_res(cur.fetchall())
                    if rows:
                        res[q[1]] = rows
                results.append(res)
            else:
                cur.execute(query)
                rows = cur.fetchall()
                if type(rows) == list:
                    for row in rows:
                        row_data = {}
                        for info in list(row):
                            row_data[info] = row[info]
                        results.append(row_data)

        except (Exception, psycopg2.DatabaseError) as error:
            print("error: ", error)
            return error, 400

        finally:
            if conn is not None:
                # close the communication with the PostgreSQL
                conn.close()
                print('Database connection closed.')
                if expecting_result:
                    if results:
                        print("res:", results)
                        return results[0], 200
                    else:
                        return "Result not found", 200
                else:
                    return "processed OK", 200
            return rows, 500


def error_message(code, message, info=None):
    """creates an html page"""
    res = "<h1>" + str(code) + "</h1><p>" + str(message) + "</p>"

    if info:
        res += "<p>" + str(info) + "</p>"
    return res, code


def dictionify_res(rows):
    """gets a psycopg2 RealDictCursor dictionary and makes it a a regular key value dictionary"""
    res = []
    if type(rows) == list:
        for row in rows:
            row_data = {}
            for info in list(row):
                row_data[info] = row[info]
            res.append(row_data)
    return res
