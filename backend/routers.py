from fastapi.responses import HTMLResponse

from email_client import EmailManager
from queries.read_queries import ReadQueries as readQ
from queries.create_queries import CreateQueries as createQ
from queries.update_queries import UpdateQueries as updateQ
from queries.delete_queries import DeleteQueries as deleteQ
from queries.connection_manager import Connection
from notifacations import NotificationsHandler
from threading import Thread
import psycopg2
import schedule
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import Optional, List, Dict
from flask import request
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, BaseSettings
import time
from typing import List


class Settings(BaseSettings):
    notifications_handler: NotificationsHandler = NotificationsHandler()
    email_client = EmailManager()


settings = Settings()
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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    notifications_handler = settings.notifications_handler
    # notifications_handler.play_schedules((1, 2, 3, 4))
    # notifications_handler.create_alert_dictionary()
    # thread = Thread(target=schedule_runner)
    # thread.start()
    # time.sleep(10)
    # del notifications_handler
    # settings.notifications_handler = None
    pass


def schedule_runner():
    i = 0
    while True and settings.notifications_handler:
        i += 1
        settings.notifications_handler.run_tasks()
        print(i)
        time.sleep(1)


@app.get('/get/containers')
def get_containers(business_id: int, container_id: int = None):
    """gets all current weight for all items of a specific business
         provided optional params: can get specific containers
        required parameters: business_id
        optional parameters: container_id """
    query, res_code = readQ.get_current_weight(business_id=business_id, container_ids=container_id,
                                               get_by_container=True)
    return process_read_query(query, res_code)


@app.get('/get/current_weights')
def get_current_weight(business_id: int, item_ids: List[int] = None):
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


@app.get('/get/notifications')
def get_notifications(business_id: int, active: bool = True, notification_id: int = None):
    """gets all notifications based on business_id,
    provided optional params: can get only active notifications and a specific notification
            required parameters: business_id
            optional parameters: active ,notification_id
    """
    query, res_code = readQ.get_notifications_with_info(business_id=business_id, active=active,
                                                        notification_id=notification_id)
    return process_read_query(query, res_code)


@app.get('/get/rules')
async def get_rules(business_id: int, active: Optional[bool] = False, rule_id: Optional[int] = -1):
    """gets all rules based on business_id,
provided optional params: can get only active rules and a specific rule
           required parameters: business_id
           optional parameters: active ,rule_id
           """
    if not business_id:
        raise HTTPException(status_code=400, detail="no business id sent")
    query = readQ.get_rules_query(business_id, active, rule_id)
    return process_read_query(query, 200)


@app.get('/get/item/history')
async def get_item_history(business_id: int, item_id: int, min_date: Optional[int] = -1, max_date: Optional[int] = -1):
    """gets an items weight history
    input: business_id, item_id - ids
           max,min dates -  Unix Timestamp - represents the time window for the history"""
    if min_date <= 0:
        min_date = None
    if max_date < 0:
        max_date = None
    if not min_date and not max_date:
        raise HTTPException(status_code=404, detail="No date to reference")
    connection = Connection()
    reading = readQ(connection)
    query, res_code = reading.get_weight_history(item_id, business_id, min_date, max_date)
    if res_code != 200:
        raise HTTPException(status_code=500, detail="Unable to create a history query")
    print(query)
    res, res_code = connection.get_result(query)
    del connection
    return res


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
    weight_query = readQ.get_current_weight(business_id)
    notifications_query, notifications_code = readQ.get_notifications_with_info(business_id, active=True)
    suppliers_query, supplier_code = readQ.get_suppliers(args)
    orders_query, orders_code = readQ.get_open_orders(args)
    # if weight_code != 200:
    #     return process_read_query([[weight_query, "weights"]], weight_code)
    if notifications_code != 200:
        return process_read_query([[notifications_query, "notifications"]], notifications_code)
    if supplier_code != 200:
        return process_read_query([[suppliers_query, "suppliers"]], supplier_code)
    if orders_code != 200:
        return process_read_query([[orders_query, "orders"]], orders_code)

    return process_read_query([[notifications_query, "notifications"],
                               [weight_query, "weights"],
                               [suppliers_query, "suppliers"],
                               [orders_query, "orders"]],
                              orders_code)


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
    unit: int = 1
    business_id: int = 1


class WeighingList(BaseModel):
    weights: List[Weighing]


@app.post('/add/weight')
async def add_weights(lis: WeighingList, client_time: int):
    """gets a WeighingList and inserts it in to the database"""

    try:
        connection = Connection()
        reader = readQ(connection)
        updater = updateQ(connection)
        arr = []
        server_time = int(time.time())
        weight_list = lis.dict()
        for weight in weight_list["weights"]:
            time_gap = client_time - weight["weighing_date"]
            weight_time = "to_timestamp(" + str(server_time - time_gap) + ")"
            if weight["weight_value"] >= 0:
                query, res_code = reader.get_container_item_id_query(weight["business_id"], weight["container_id"])
                if res_code != 200:
                    raise HTTPException(status_code=res_code, detail=query)
                res = connection.get_result(query)
                item_id_dict = res[0]
                if len(item_id_dict) > 0:
                    item_id = item_id_dict["item_id"]
                else:
                    raise HTTPException(status_code=404, detail="Container has no item configured")
                arr.insert(0, [weight_time, weight["business_id"], weight["container_id"], item_id,
                               weight["weight_value"], weight["last_user"], weight["unit"]])

        query, res_code = updater.insert_to_table_query("weights",
                                                        ["weighing_date", "business_id", "container_id", "item_id",
                                                         "weight_value", "last_user", "unit"],
                                                        arr)

        connection.insert_data(query, res_code)
        await manager.broadcast(f"weights updated on #{client_time}", 1)
        del connection

    except (Exception, psycopg2.DatabaseError) as error:
        settings.email_client.email_admin("Unable to add weight", "error details:" + str(error))
        raise HTTPException(status_code=400, detail="unable to add weight")


class OrderItem(BaseModel):
    order_id: int = 0
    business_id: int
    supplier_id: int
    item_id: int
    amount: float
    unit: int


@app.post('/order/add/item')
async def add_order_item(item: OrderItem):
    # async def add_order_item(item_id: int, order_id: int, business_id: int, supplier_id: int, amount: int, unit: int):

    item = item.dict()
    # print(json.loads(item))

    try:
        connection = Connection()
        updater = updateQ(connection)
    except (Exception, psycopg2.DatabaseError) as error:
        print("error: ", error)
        raise HTTPException(status_code=400, detail="Item not found")
        # return error, 400
    res, res_code, order_id = updater.add_order_item(item["item_id"], item["order_id"], item["business_id"],
                                                     item["supplier_id"], item["amount"], item["unit"])
    # res, res_code, order_id = updater.add_order_item(item_id, order_id, business_id,
    #                                                  supplier_id, amount, unit)

    del connection
    return res, res_code
    # query, res_code = createQ.insert_to_table_query("weights",
    #                                                 ["weighing_date", "container_id", "weight_value", "last_user"],
    #                                                 arr)
    # await manager.broadcast(f"weights updated on #{client_time}", 1)
    # return process_create_query([[query, "add weights"]], res_code)


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


class WebSocketManager:
    def __init__(self):
        self.active_connections = {}

    async def connect_socket(self, websocket: WebSocket, business_id: int):
        await websocket.accept()
        if business_id not in self.active_connections:
            self.active_connections[business_id] = []
        self.active_connections[business_id].append(websocket)
        # await self.broadcast(str(business_id)+" joined the room ", business_id, websocket)

    def disconnect(self, websocket: WebSocket, business_id: int):
        self.active_connections[business_id].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, business_id: int, websocket: WebSocket = None):
        if business_id in self.active_connections:
            for connection in self.active_connections[business_id]:
                if websocket != connection:
                    await connection.send_text(message)
        else:
            print("no client connected")


manager = WebSocketManager()
html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/wss");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


@app.get('/get/wss')
async def return_socket_page():
    """socket test"""
    return HTMLResponse(html)


@app.websocket("/wss")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")


@app.websocket("/ws/{business_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, business_id: int, user_id: int):
    """create a connection with the client accessing this route"""
    await manager.connect_socket(websocket, business_id)
    try:
        while True:
            data = await websocket.receive_text()
            # await manager.send_personal_message(f"You wrote: {data}", websocket)
            await manager.broadcast(f"Client {user_id} from {business_id} says: {data}", business_id, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket, business_id)
        # await manager.broadcast(f"Client #{user_id} left the chat")
