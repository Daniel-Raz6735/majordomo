from flask import request, jsonify
from psycopg2.extras import RealDictCursor
from config import config
from functions import Functions
from db_queries import DbQueries
import psycopg2


class ReadQueries:
    def __init__(self):
        pass

    @staticmethod
    def get_rules(args):
        """method for getting the rules by business id
            parameters received: required: business_id, optional: active, rule_id
            output:[["rule_id", "item_id", "content_minimum_per_day", "content_maximum_per_day",
                "content_total_minimum", "content_total_maximum", "active"]....]"""

        list_of_cols = ["business_id", "active", "rule_id"]
        used_p, non_used_p = Functions.phrase_parameters(args, list_of_cols)
        conditions = []
        if "business_id" in used_p:
            conditions.append(["AND", "rules.business_id", "=", int(used_p["business_id"])])
        else:
            return error_message(400, "Bad request", "no business id sent"), 400
        if "active" in used_p:
            conditions.append(["AND", "rules.active", "=", used_p["business_id"]])
        final_query, res_code = DbQueries.select_query(
            ["rules"],
            [[["rule_id"], ["item_id"], ["content_minimum_per_day"], ["content_maximum_per_day"],
              ["content_total_minimum"], ["content_total_maximum"], ["active"]]],
            conditions)
        if res_code != 200:
            return error_message(res_code, final_query), 400
        return final_query, 200

    @staticmethod
    def get_notifications(args):
        """method for getting the active notifications by business id
            parameters received: required: business_id,
            optional: active, notification_id
            output:[["code", "message", "item_id", "active", "closed_by_user"]]"""
        list_of_cols = ["business_id", "active", "notification_id"]
        # used_p, non_used_p = Functions.phrase_parameters(args, list_of_cols)
        used_p=args
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
             [["item_name"]],
             [["category_id"], ["category_name"]],
             [["date"], ["item_name"], ["weight"]]
             ],
            conditions)
        if res_code != 200:
            return error_message(res_code, final_query), 400
        return final_query, 200

    @staticmethod
    def get_current_weight(args, get_by_container=False):
        list_of_cols = ["container_id", "business_id", "items_ids"]
        # used_p, non_used_p = Functions.phrase_parameters(args, list_of_cols)
        used_p = args
        conditions = []
        if "business_id" in used_p:
            conditions.append(["AND", "containers.business_id", "=", int(used_p["business_id"])])
        else:
            return error_message(400, "Bad request", "no business id sent"), 400
        if "container_id" in used_p:
            containers = used_p["container_id"]
            and_or = "AND"
            if type(containers) == list:
                for container in containers:
                    conditions.append([and_or, "containers.container_id", "=", int(container)])
                    and_or = "OR"
            else:
                conditions.append(["AND", "containers.container_id", "=", int(containers)])
        if "item_ids" in used_p:
            and_or = "AND"
            items = used_p["item_ids"]
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
                         [["item_name"], ["item_id"]],
                         [["category_name"], ["category_id"]],
                         []]
        if not get_by_container:
            cols_to_bring = [[[]],
                             [["weight_value", "weight", "SUM"], ["weighing_date", "date", "MAX"]],
                             [["item_name"], ["item_id"]],
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
    def get_suppliers(args):
        list_of_cols = ["business_id", "items_ids"]
        # used_p, non_used_p = Functions.phrase_parameters(args, list_of_cols)
        used_p=args
        conditions = []
        if "business_id" in used_p:
            conditions.append(["AND", "supplier.business_id", "=", int(used_p["business_id"])])
        else:
            return error_message(400, "Bad request", "no business id sent"), 400

        if "item_ids" in used_p:
            and_or = "AND"
            items = used_p["item_ids"]
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
    def get_user_preferences(args):
        list_of_params = ["user_email"]
        used_p, non_used_p = Functions.phrase_parameters(args, list_of_params)
        column_list = [[["lang"]], [["user_id"]]]
        conditions = []
        if "user_email" in used_p:
            email = used_p["user_email"].split("@")
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
                        print("res:",results)
                        return results, 200
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
