from old_firebase.old_firebase import receive_old_container
from psycopg2.extras import RealDictCursor
from flask import request, jsonify
from flask_cors import CORS
from config import config
import db_queries
import table_info
import psycopg2
import flask
import numpy as np
import pandas as pd
import json
import os


app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True
indexes = {
    "container_id": 0,
    "user_id": 0,
    "business_id": 0
}
tables_to_read = [
    "indexes",
    "categories",
    "users",
    "user_preference",
    "business",
    "food_items",
    "supplier",
    "department",
    "notifications",
    "orders",
    "order_content",
    "recipes",
    "recipe_content",
    "containers",
    "weights",
    "rules"
]


def load_dummy_data(tables_to_read, tables):
    if not tables_to_read or not tables:
        return 500
    for table in tables_to_read:
        res_code, query = db_queries.insert_to_table_query(table, tables[table]["column"], tables[table]["data"])
        res, res_code = select_connection(query,expecting_result=False)
    return res_code


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
        cur.execute(query)
        # conn.commit()
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
                    return jsonify(results), 200
                else:
                    return "Result not found", 200
            else:
                return "processed OK", 200
        return rows, 500


def phrase_result(res, column_list):

    return res


def phrase_parameters(params, used_params):
    query_parameters = {}
    non_used_params = {}
    for param in params:
        p = params[param]
        if ";" not in p:
            if param in used_params:
                query_parameters[param] = p
            else:
                non_used_params[param] = p
    return query_parameters, non_used_params


def error_message(code, message, info=None):
    res = "<h1>" + str(code) + "</h1><p>" + str(message) + "</p>"

    if info:
        res += str(info)
    return res, code


@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p>", 404


@app.route('/', methods=['GET'])
def home():
    return '''<h1>Majordomo back end</h1>'''


@app.route('/get/preferences', methods=['GET'])
def get_user_preferences():
    list_of_params = ["user_email"]
    used_p, non_used_p = phrase_parameters(request.args, list_of_params)
    column_list = [[["lang"]], [["user_id"]]]
    conditions = []
    if "user_email" in used_p:
        email = used_p["user_email"].split("@")
        if len(email) != 2:
            return error_message(400, "Bad request", " invalid email")
        conditions.append(["AND", "users.email_user_name", "=", "'" + email[0] + "'"])
        conditions.append(["AND", "users.email_domain_name", "=", "'" + email[1] + "'"])
        conditions.append(["AND", "users.user_id", "=", "user_preference.user_id"])
    else:
        return error_message(400, "Bad request", " user email not sent")
    
    res_code, final_query = db_queries.select_query(["user_preference", "users"],
                                                    column_list,
                                                    conditions)
    if res_code != 200:
        return error_message(res_code, final_query)
    print(final_query)
    result, res_code = select_connection(final_query)
    if res_code == 200:
        return result, res_code
    else:
        return error_message(res_code, "unable to process request")


@app.route('/get/containers', methods=['GET'])
def get_weights_data():
    list_of_cols = ["container_id", "client_id"]
    used_p, non_used_p = phrase_parameters(request.args, list_of_cols)
    conditions = []
    if "client_id" in used_p:
        conditions.append(["AND", "containers.business_id", "=", int(used_p["client_id"])])
    else:
        return error_message(400, "Bad request", "no client id sent")
    if "container_id" in used_p:
        conditions.append(["AND", "containers.container_id", "=", int(used_p["container_id"])])
    conditions.append(["AND", "weights.container_id", "=", "containers.container_id"])
    max_table = db_queries.select_query(["containers", "weights"],
                                        [[["container_id"]], [["weighing_date", "date", "MAX"]]],
                                        conditions)
    max_table = max_table[1][:-1]
    conditions.append(["AND", "food_items.item_id", "=", "containers.item_id"])
    conditions.append(["AND", "t1.date", "=", "weights.weighing_date"])
    conditions.append(["AND", "t1.container_id", "=", "containers.container_id"])

    res_code, final_query = db_queries.select_query(
        ["containers", "weights", "food_items", ["(" + max_table + ")", "t1"]],
        [[["container_id"]], [["weight_value", "weight"], ["weighing_date", "date"]], [["item_name"]], []],
        conditions)
    if res_code != 200:
        return error_message(res_code, final_query)

    result, res_code = select_connection(final_query)
    if res_code == 200:
        return result
    else:
        return error_message(res_code, result, "unable to process request")


@app.route('/get/notifications', methods=['GET'])
def get_notifications():
    """method for getting the active notifications by business id
        parameters received: required: business_id, optional: active, notification_id
        output:[["code", "message", "food_item_id", "active", "closed_by_user"]]"""
    list_of_cols = ["business_id", "active", "notification_id"]
    used_p, non_used_p = phrase_parameters(request.args, list_of_cols)
    conditions = []
    if "business_id" in used_p:
        conditions.append(["AND", "notifications.business_id", "=", int(used_p["business_id"])])
    else:
        return error_message(400, "Bad request", "no business id sent")
    if "active" in used_p:
        conditions.append(["AND", "notifications.active", "=", used_p["active"]])
    if "notification_id" in used_p:
        conditions.append(["AND", "notifications.notification_id", "=", used_p["notification_id"]])
    res_code, final_query = db_queries.select_query(
        ["notifications"],
        [[["code"], ["message"], ["food_item_id"], ["active"], ["closed_by_user"]]],
        conditions)
    if res_code != 200:
        return error_message(res_code, final_query)

    result, res_code = select_connection(final_query)
    if res_code == 200:
        return result
    else:
        return error_message(res_code, result, "unable to process request")


@app.route('/get/rules', methods=['GET'])
def get_rules():
    """method for getting the rules by business id
        parameters received: required: business_id, optional: active, rule_id
        output:[["rule_id", "item_id", "content_minimum_per_day", "content_maximum_per_day",
            "content_total_minimum", "content_total_maximum", "active"]....]"""

    list_of_cols = ["business_id", "active", "rule_id"]
    used_p, non_used_p = phrase_parameters(request.args, list_of_cols)
    conditions = []
    if "business_id" in used_p:
        conditions.append(["AND", "rules.business_id", "=", int(used_p["business_id"])])
    else:
        return error_message(400, "Bad request", "no business id sent")
    if "active" in used_p:
        conditions.append(["AND", "rules.active", "=", used_p["business_id"]])
    res_code, final_query = db_queries.select_query(
        ["rules"],
        [[["rule_id"], ["item_id"], ["content_minimum_per_day"], ["content_maximum_per_day"],
            ["content_total_minimum"], ["content_total_maximum"], ["active"]]],
        conditions)
    if res_code != 200:
        return error_message(res_code, final_query)

    result, res_code = select_connection(final_query)
    if res_code == 200:
        return result
    else:
        return error_message(res_code, result, "unable to process request")


@app.route('/get/restart', methods=['GET'])
def restart_tables():
    drop_tables()
    print("*****************removed********************")
    code, query = db_queries.add_table_code()
    result, code = select_connection(query, False)
    return str(code)


@app.route('/get/create', methods=['GET'])
def create():
    code, query = db_queries.add_table_code()
    code = select_connection(query)
    return str(code)


@app.route('/get/drop/all', methods=['GET'])
def drop_tables():
    if not tables_to_read:
        return "500"
    for table in tables_to_read:
        res_code, query = db_queries.drop_table_query(table)
        select_connection(query)
    return "200"


@app.route('/get/add/dummy_data', methods=['GET'])
def add_dummy():

    res = load_dummy_data(tables_to_read, table_info.tables)
    return select_connection(res, False)


def call_indexes():
    print(indexes)


def calculate_rules():
    rules = get_rules()
    notifications = get_notifications()
    print(rules, notifications)


if __name__ == '__main__':
    # call_indexes()
    app.run()
    # tests()
    # receive_old_container(os.path.join("old_firebase"))

# def tests():
#     conditions = [["AND", "client_id", "=", 1],
#                   ["AND", "containers.container_id", "=", int(1)],
#                   ["AND", "weights.container_id", "=", "containers.container_id"],
#                   ["AND", "food_items.item_id", "=", "containers.item_id"]]
#     res = db_queries.select_query(["containers", "weights", "food_items"],
#                                   [[["container_id"]], [["weight_value", "weight"]], [["item_name"]]], conditions,
#                                   ["container_id", "weight"])
#     if res[0] == 200 and res[1] == """SELECT containers.container_id, weights.weight_value AS weight, food_items.item_name
# FROM containers, weights, food_items
# WHERE  client_id  =  1 ,  AND  containers.container_id  =  1 ,  AND  weights.container_id  =  containers.container_id ,  AND  food_items.item_id  =  containers.item_id ;""":
#         print("passed select test")
#     else:
#         print("failed select test")
#     print(res[1])

# def create_proj_tables():
#     weights_vars = [
#         ["container_id", "int", "NOT NULL"],
#         ["weighing_time", "timestamp", "NOT NULL"],
#         ["weight_value", "real", "NOT NULL"]
#     ]
#
#     containers_vars = [["container_id", "int", "NOT NULL"],
#                        ["using_start_date", "timestamp", "NOT NULL"],
#                        ["item_id", "int", "NULL"],
#                        ["client_id", "int", "NULL"]
#                        ]
#
#     select_connection(db_queries.create_table_query("weights", weights_vars)[1])
#     select_connection(db_queries.create_table_query("containers", containers_vars)[1])
