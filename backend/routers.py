from queries.read_queries import ReadQueries as readQ
from queries.create_queries import CreateQueries as createQ
from queries.update_queries import UpdateQueries as updateQ
from queries.delete_queries import DeleteQueries as deleteQ
import flask
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import Optional,List
from flask import request
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import datetime
import time
from typing import List
app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5000",
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app = flask.Flask(__name__)
# CORS(app)
# app.config["DEBUG"] = True
indexes = {
    "container_id": 0,
    "user_id": 0,
    "business_id": 0
}


@app.route('/get/containers', methods=['GET'])
def get_containers():
    """gets all current weight for all items of a specific business
         provided optional params: can get specific containers
        required parameters: business_id
        optional parameters: container_id """
    query, res_code = readQ.get_current_weight(request.args, get_by_container=True)
    return process_read_query(query, res_code)


@app.route('/get/current_weights', methods=['GET'])
def get_current_weight():
    """gets all current weight for all items of a specific business
     provided optional params: can get specific items by item id
    required parameters: business_id
    optional parameters: item_ids"""
    query, res_code = readQ.get_current_weight(request.args)
    return process_read_query(query, res_code)


@app.route('/get/preferences', methods=['GET'])
def get_user_preferences():
    """gets preferences for a specific user based on user_email
        required parameters: user_email
        optional parameters: none"""
    query, res_code = readQ.get_user_preferences(request.args)
    return process_read_query(query, res_code)


@app.route('/get/notifications', methods=['GET'])
def get_notifications():
    """gets all notifications based on business_id,
    provided optional params: can get only active notifications and a specific notification
            required parameters: business_id
            optional parameters: active ,notification_id
    """
    query, res_code = readQ.get_notifications(request.args)
    return process_read_query(query, res_code)


@app.route('/get/rules', methods=['GET'])
def get_rules():
    """gets all rules based on business_id,
provided optional params: can get only active rules and a specific rule
           required parameters: business_id
           optional parameters: active ,rule_id
           """
    query, res_code = readQ.get_rules(request.args)
    return process_read_query(query, res_code)


@app.get('/get/suppliers')
async def get_suppliers(business_id: int, item_id: Optional[int] = -1, item_ids: Optional[List] = None):
    """gets all suppliers based on business_id,
        provided optional params: can get only specific suppliers by item_ids"""
    args = {"business_id": business_id}
    ids = None
    if item_id > 0:
        ids = [item_id]
    elif item_ids:
        ids = item_ids
    if ids:
        args["items_ids"] = ids
    query, res_code = readQ.get_suppliers(args)
    return process_read_query(query, res_code)


@app.get('/get/current_view')
async def get_current_view(business_id: int):
    """gets all the info a user needs based on business_id"""
    args = {"business_id": business_id, "active": True}
    weight_query, weight_code = readQ.get_current_weight(args)
    notifications_query, notifications_code = readQ.get_notifications(args)
    suppliers_query, supplier_code = readQ.get_suppliers(args)

    return process_read_query([[notifications_query, "notifications"],
                               [weight_query, "weights"],
                               [suppliers_query, "suppliers"]],
                              supplier_code)


# @app.get('/')
# async def read_item(item_id: str, q: Optional[str] = None):
#     if q:
#         return {"item_id": item_id, "q": q}
#     return {"item_id": item_id}

@app.get('/')
async def home():
    return '<h1>Majordomo back end</h1>'


class Weighing(BaseModel):
    container_id: int
    weight_value: float
    weighing_date: int
    last_user: int = None


class WeighingList(BaseModel):
    weights: List[Weighing]


@app.post('/add/weight')
async def add_weights(lis: WeighingList, client_time: int):
    arr = []
    server_time = int(time.time())
    weight_list = lis.dict()
    for weight in weight_list["weights"]:
        time_gap = client_time-weight["weighing_date"]
        weight_time = "to_timestamp("+str(server_time-time_gap)+")"
        arr.insert(0, [weight_time, weight["container_id"], weight["weight_value"], weight["last_user"]])
    query, res_code = createQ.insert_to_table_query("weights",
                                                    ["weighing_date", "container_id", "weight_value", "last_user"],
                                                    arr)
    return process_create_query([[query, "add weights"]], res_code)

# @app.get('/')
# async def read_item(item_id: str, q: Optional[str] = None):
#     if q:
#         return {"item_id": item_id, "q": q}
#     return {"item_id": item_id}


# @app.route('/get/create', methods=['GET'])
# def create():
#     pass
#
#
# @app.route('/get/drop/all', methods=['GET'])
# def drop_tables():
#     pass
#
#
# @app.route('/get/add/dummy_data', methods=['GET'])
# def add_dummy():
#     pass


# @app.errorhandler(404)
# def page_not_found(e):
#     return "<h1>404</h1><p>The resource could not be found.</p><p>" + str(e) + "</p>", 404


# @app.route('/', methods=['GET'])
# def home():
#     return {'<h1>Majordomo back end</h1>'}


def error_message(code, message, info=None):
    res = "<h1>" + str(code) + "</h1><p>" + str(message) + "</p>"

    if info:
        res += "<p>" + str(info) + "</p>"
    return res, code


def process_read_query(query, res_code):
    if res_code != 200:
        return query
    result, res_code = readQ.select_connection(query)
    if res_code == 200:
        return JSONResponse(content=jsonable_encoder(result))
    else:
        return error_message(res_code, result, "unable to process request")


def process_create_query(query, res_code):
    if res_code != 200:
        return query
    result, res_code = createQ.insert_connection(query)
    if res_code == 200:
        return JSONResponse(content=jsonable_encoder(result[0]))
    else:
        return error_message(res_code, result, "unable to process request")
# @app.route('/get/restart', methods=['GET'])
# def restart_tables():
#     drop_tables()
#     print("*****************removed********************")
#     code, query = db_queries.add_table_code()
#     result, code = select_connection(query, False)
#     return str(code)

# if __name__ == '__main__':
#     app.run()