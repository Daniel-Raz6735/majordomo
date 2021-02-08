
from flask import request, jsonify
from config import config
import db_queries
import table_info
from psycopg2.extras import RealDictCursor
import psycopg2
import flask
import numpy as np
import pandas as pd
import json
import os


class Functions:
    def __init__(self):
        pass

    @staticmethod
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




    # call_indexes()
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
