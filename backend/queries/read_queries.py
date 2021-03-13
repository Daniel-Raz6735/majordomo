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
    def get_rules(args):
        """method for getting the rules by business id
            parameters received: required: business_id, optional: active, rule_id
            output:[["rule_id", "item_id", "content_minimum_per_day", "content_maximum_per_day",
                "content_total_minimum", "content_total_maximum", "active"]....]"""

        # list_of_cols = ["business_id", "active", "rule_id"]
        # used_p, non_used_p = Functions.phrase_parameters(args, list_of_cols)
        conditions = []
        if "business_id" in args:
            conditions.append(["AND", "rules.business_id", "=", int(args["business_id"])])
        else:
            return error_message(400, "Bad request", "no business id sent"), 400
        if "active" in args:
            conditions.append(["AND", "rules.active", "=", args["business_id"]])
        final_query, res_code = DbQueries.select_query(
            ["rules"],
            [[["rule_id"], ["item_id"], ["content_minimum_per_day"], ["content_maximum_per_day"],
              ["content_total_minimum"], ["content_total_maximum"], ["active"]]],
            conditions)
        if res_code != 200:
            return error_message(res_code, final_query), 400
        return final_query, 200

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
                                                       [[], [["item_id"], ["order_id"], ["price_per_unit"], ["amount"], ["unit"]]],
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
    def get_notifications(args):
        """method for getting the active notifications by business id
            parameters received: required: business_id,
            optional: active, notification_id
            output:[["code", "message", "item_id", "active", "closed_by_user"]]"""
        # list_of_cols = ["business_id", "active", "notification_id"]
        # used_p, non_used_p = Functions.phrase_parameters(args, list_of_cols)
        used_p = args
        conditions = []
        if "business_id" in used_p:
            conditions.append(["AND", "notifications.business_id", "=", int(used_p["business_id"])])
        else:
            return error_message(400, "Bad request", "no business id sent"), 400
        if "active" in used_p:
            conditions.append(["AND", "notifications.active", "=", used_p["active"]])
        if "notification_id" in used_p:
            conditions.append(["AND", "notifications.notification_id", "=", used_p["notification_id"]])
        conditions.append(["AND", "notifications.food_item_id", "=", "food.item_id"])
        conditions.append(["AND", "food.category_id", "=", "cat.category_id"])
        sub_table, res_code = ReadQueries.get_current_weight({"business_id": used_p["business_id"]})
        if res_code != 200:
            return sub_table, res_code
        sub_table = sub_table[:-1]
        conditions.append(["AND", "sub.item_id", "=", "food.item_id"])

        final_query, res_code = DbQueries.select_query(
            [["notifications"], ["food_items", "food"], ["categories", "cat"], ["("+sub_table+")", "sub"]],
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
    def get_current_weight(args, get_by_container=False):
        # list_of_cols = ["container_id", "business_id", "items_ids"]
        # used_p, non_used_p = Functions.phrase_parameters(args, list_of_cols)
        # used_p = args
        conditions = []
        if "business_id" in args:
            conditions.append(["AND", "containers.business_id", "=", int(args["business_id"])])
        else:
            return error_message(400, "Bad request", "no business id sent"), 400
        if "container_id" in args:
            containers = args["container_id"]
            and_or = "AND"
            if type(containers) == list:
                for container in containers:
                    conditions.append([and_or, "containers.container_id", "=", int(container)])
                    and_or = "OR"
            else:
                conditions.append(["AND", "containers.container_id", "=", int(containers)])
        if "item_ids" in args:
            and_or = "AND"
            items = args["item_ids"]
            for item in items:
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

        cols_to_bring = [[["container_id"]],
                         [["weight_value", "weight"], ["weighing_date", "date"]],
                         [["item_name"], ["item_id"], ["unit"]],
                         [["category_name"], ["category_id"]],
                         []]
        if not get_by_container:
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
            return error_message(res_code, final_query), 400
        return final_query, 200

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
            conditions.append(["AND", "weights.weighing_date", ">=",  "to_timestamp(" + str(min_date) + ")"])
        if max_date is not None:
            conditions.append(["AND", "weights.weighing_date", "<=", "to_timestamp(" + str(max_date) + ")"])

        cols_to_bring = [[["weight_value", "weight", "SUM"], ["weighing_date", "date"],
                          ["unit"], ["item_id"]]]

        query, res_code = DbQueries.select_query(["weights"], cols_to_bring, conditions)
        if res_code != 200:
            raise HTTPException(status_code=500, detail="Error creating weight query")
        return query, 200

    @staticmethod
    def get_suppliers(args):
        # list_of_cols = ["business_id", "items_ids"]
        conditions = []
        if "business_id" in args:
            conditions.append(["AND", "supplier.business_id", "=", int(args["business_id"])])
        else:
            return error_message(400, "Bad request", "no business id sent"), 400

        if "item_ids" in args:
            and_or = "AND"
            items = args["item_ids"]
            for item in items:
                conditions.append([and_or, "supplier.item_id", "=", int(item)])
                and_or = "OR"

        conditions.append(["AND", "supplier.supplier_id", "=", "users.user_id"])

        final_query, res_code = DbQueries.select_query(
            ["supplier", "users"],
            None,
            conditions)
        if res_code != 200:
            return error_message(res_code, final_query), 400
        return final_query, 200

    @staticmethod
    def get_open_orders(args):
        conditions = []
        if "business_id" in args:
            conditions.append(["AND", "orders.business_id", "=", int(args["business_id"])])
        else:
            return error_message(400, "Bad request", "no business id sent"), 400

        if "order_ids" in args:
            and_or = "AND"
            orders = args["order_ids"]
            for order in orders:
                conditions.append([and_or, "orders.order_id", "=", int(order)])
                and_or = "OR"

        conditions.append(["AND", "orders.order_id", "=", "content.order_id"])
        conditions.append(["AND", "orders.order_date", "=", "null"])

        final_query, res_code = DbQueries.select_query(
            ["orders", ["order_content", "content"]],
            None,
            conditions)
        if res_code != 200:
            return error_message(res_code, final_query), 400
        return final_query, 200

    @staticmethod
    def get_user_preferences(args):
        # list_of_params = ["user_email"]
        # used_p, non_used_p = Functions.phrase_parameters(args, list_of_params)
        column_list = [[["lang"]], [["user_id"]]]
        conditions = []
        if "user_email" in args:
            email = args["user_email"].split("@")
            if len(email) != 2:
                return error_message(400, "Bad request", " invalid email"), 400
            conditions.append(["AND", "users.email_user_name", "=", "'" + email[0] + "'"])
            conditions.append(["AND", "users.email_domain_name", "=", "'" + email[1] + "'"])
            conditions.append(["AND", "users.user_id", "=", "user_preference.user_id"])
        else:
            return error_message(400, "Bad request", " user email not sent"), 400

        final_query, res_code = DbQueries.select_query(["user_preference", "users"],
                                                       column_list,
                                                       conditions)
        if res_code != 200:
            return error_message(res_code, final_query), 400
        return final_query, 200

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
    res = "<h1>" + str(code) + "</h1><p>" + str(message) + "</p>"

    if info:
        res += "<p>" + str(info) + "</p>"
    return res, code


def dictionify_res(rows):
    res = []
    if type(rows) == list:
        for row in rows:
            row_data = {}
            for info in list(row):
                row_data[info] = row[info]
            res.append(row_data)
    return res
