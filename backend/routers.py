from fastapi.responses import HTMLResponse

from email_client import EmailManager
from queries.read_queries import ReadQueries as readQ
from queries.create_queries import CreateQueries as createQ
from queries.update_queries import UpdateQueries as updateQ
from queries.update_queries import UserInfo
from queries.delete_queries import DeleteQueries as deleteQ
from utilities.logs import LogManager
from utilities.websockets import WebSocketManager
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
    log_manager = LogManager()
    web_socket_manager = WebSocketManager()


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
    # settings.log_manager.log_debug("application started now")
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
def get_containers(business_id: int = None, container_id: Optional[int] = None, item_id: Optional[int] = None):
    """gets all current weight for all items of a specific business
         provided optional params: can get specific containers, all containers per item
        required parameters: business_id
        optional parameters: container_id, item_id """
    if item_id:
        item_id = [item_id]
    query = readQ.get_current_weight_query(business_id=business_id, container_ids=container_id,
                                           item_ids=item_id, get_by_container=True)
    connection = Connection()
    return connection.get_result(query)


@app.get('/get/current_weights')
def get_current_weight(business_id: int, item_ids: List[int] = None):
    """gets all current weight for all items of a specific business
     provided optional params: can get specific items by item id
    required parameters: business_id
    optional parameters: item_ids"""
    query = readQ.get_current_weight_query(business_id=business_id, item_ids=item_ids)
    connection = Connection()
    return connection.get_result(query)


@app.get('/get/preferences')
def get_user_preferences(user_email: str):
    """gets preferences for a specific user based on user_email
        required parameters: user_email"""
    query = readQ.get_user_preferences_query(user_email)
    return process_read_query(query)


@app.get('/get/notifications')
def get_notifications(business_id: int, active: bool = True, notification_id: int = None):
    """gets all notifications based on business_id,
    provided optional params: can get only active notifications and a specific notification
            required parameters: business_id
            optional parameters: active ,notification_id
    """
    query, res_code = readQ.get_notifications_with_info(business_id=business_id, active=active,
                                                        notification_id=notification_id)
    connection = Connection()
    return connection.get_result(query)


# todo add new functionality
@app.post('/items/add')
async def add_item(business_id: int, category_id: int):
    """add item to business """
    pass
    #     connection = Connection()
    #     updater = updateQ(connection)
    #     reader = readQ(connection)


@app.get('/get/items')
async def get_items(business_id: int):
    """get all items of business """
    pass
    connection = Connection()
    reader = readQ(connection)
    query = reader.get_items(business_id=business_id)
    return connection.get_result(query)


@app.get('/get/item/history')
async def get_item_history(business_id: int, item_id: int, min_date: Optional[int] = -1, max_date: Optional[int] = -1):
    """gets an items weight history
    input: business_id, item_id - ids
           max,min dates -  Unix Timestamp - represents the time window for the history.
           it is required to send one date of reference"""
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
    res = connection.get_result(query)
    del connection
    return res


@app.get('/get/suppliers')
async def get_suppliers(business_id: int, item_id: Optional[int] = -1, item_ids: Optional[List] = None):
    """gets all suppliers based on business_id,
        provided optional params: can get only specific suppliers by item_ids"""
    ids = None
    if item_id > 0:
        ids = [item_id]
    elif item_ids:
        ids = item_ids
    query = readQ.get_suppliers_query(business_id, items_ids=ids)
    connection = Connection()
    return connection.get_result(query)


@app.post('/containers/pair')
async def pair_container_to_item(business_id: int, container_id: int, item_id: int):
    """pair a container that belongs to the business provided, to the item that was provided.
    removes all previous container pairings"""
    connection = Connection()
    updater = updateQ(connection)
    reader = readQ(connection)
    container_query = reader.get_container_by_id_query(container_id)
    container_res = connection.get_result(container_query)
    try:
        container = container_res[0]
        if business_id != container["business_id"]:
            raise Exception
    except Exception:
        raise HTTPException(status_code=403, detail="Container does not belong to business")
    item_query = reader.get_items(item_id, business_id)
    item_res = connection.get_result(item_query)
    if item_res is None or len(item_res) < 1:
        raise HTTPException(status_code=403, detail="Item does not belong to business")
    remove_query = updater.disable_container_query(container_id)
    connection.insert_data(remove_query, "unable to remove container")
    addition_query = updater.add_container_to_business_query(business_id, container_id, item_id)
    connection.insert_data(addition_query, "unable to add container")


@app.post('/edit/container')
async def add_container_to_business(business_id: int, container_id: Optional[int] = None):
    """admin removal of container from all businesses and add to a specific business
    if no container_id provided then creates new one.
    returns the container id of the container added"""
    connection = Connection()
    updater = updateQ(connection)
    reader = readQ(connection)
    have_container_id = container_id is not None
    business_query = reader.get_business_query(business_id)
    business_info = connection.get_result(business_query)
    if not business_info or len(business_info) < 1:
        raise HTTPException(status_code=404, detail="Business id not found")
    if have_container_id:
        remove_query = updater.disable_container_query(container_id)
        connection.insert_data(remove_query, "unable to remove container")
    addition_query = updater.add_container_to_business_query(business_id, container_id)
    connection.insert_data(addition_query, "unable to add container")
    if not have_container_id:
        get_container_id = reader.get_new_container()
        res = connection.get_result(get_container_id)
        if res and len(res) > 0 and res[0] and "container_id" in res[0] and res[0]["container_id"]:
            container_id = res[0]["container_id"]
        else:
            raise HTTPException(status_code=500, detail="error retrieving new container created ")
    return container_id


@app.get('/get/users')
def get_users(business_id: int = None, get_supplier: bool = False, get_businesses: bool = False):
    """gets all users in the DB
    """
    res = {}
    connection = Connection()
    users_query = readQ.get_users_query(business_id=business_id)
    res["users"] = connection.get_result(users_query)
    # if get_supplier:
    #     users_query = readQ.get_users_query(business_id=business_id)
    #     res["suppliers"] = connection.get_result(users_query)
    # if get_businesses:
    #     business_query = readQ.get_users_query(business_id=business_id)
    #     res["businesses"] = connection.get_result(business_query)
    for user in res["users"]:
        user["email"] = user["email_user_name"]+"@"+user["email_domain_name"]
    return res


@app.get('/edit/user')
def edit_user():
    """"""
    res = {}
    try:
        connection = Connection()
        reader = readQ(connection)
        updater = updateQ(connection)
        updater.edit_user()
        arr = []
        # weight_list = lis.dict()
        # for weight in weight_list["weights"]:
        #     time_gap = client_time - weight["weighing_date"]
        #     weight_time = "to_timestamp(" + str(server_time - time_gap) + ")"
        #     if weight["weight_value"] >= 0:
        #         query = reader.get_container_item_id_query(weight["business_id"], weight["container_id"])
        #         res = connection.get_result(query)
        #
        #         if len(res) > 0:
        #             item_id = res[0]["item_id"]
        #         else:
        #             raise HTTPException(status_code=404, detail="Container has no item configured for this business")
        #         arr.insert(0, [weight_time, weight["business_id"], weight["container_id"], item_id,
        #                        weight["weight_value"], weight["last_user"]])
    except (Exception):
        pass

    return res


@app.post('/containers/remove')
async def remove_container(container_id: int):
    """admin removal of a container from all businesses"""
    remove_query = updateQ.disable_container_query(container_id)
    connection = Connection()
    connection.insert_data(remove_query, "unable to remove container")


@app.get('/get/current_view')
async def get_current_view(business_id: int, user_email: str = "shlomow6@gmail.com"):
    """gets all the info a user needs based on business_id
    output: "preferences": pre,
            "notifications": notifications,
            "weights": weights,
            "suppliers": suppliers,
            "orders": orders,"""
    if ";" in user_email:
        raise HTTPException(status_code=400, detail="Illegal email")
    message = "unable to load preference"
    user_preferences_query = readQ.get_user_preferences_query(user_email)
    message = "unable to load items"
    items_query = readQ.get_items(business_id)
    message = "unable to load weight"
    weight_query = readQ.get_current_weight_query(business_id)
    message = "unable to load notifications"
    notifications_query, notifications_code = readQ.get_notifications_with_info(business_id, active=True)
    message = "unable to load suppliers"
    suppliers_query = readQ.get_suppliers_query(business_id)
    message = "unable to load orders"
    orders_query, orders_code = readQ.get_open_orders_query(business_id)

    try:
        if notifications_code != 200:
            message = notifications_query
            raise Exception
        if orders_code != 200:
            message = orders_query
            raise Exception
        connection = Connection()
        # reader = readQ(connection)
        message = "unable to load preferences"
        preferences = connection.get_result(user_preferences_query)
        message = "unable to load items"
        items = connection.get_result(items_query)
        message = "unable to load notifications"
        notifications = connection.get_result(notifications_query)
        message = "unable to load weights"
        weights = connection.get_result(weight_query)
        message = "unable to load suppliers"
        suppliers = connection.get_result(suppliers_query)
        message = "unable to load orders"
        orders = connection.get_result(orders_query)

        res = {
            "preferences": preferences,
            "items": items,
            "notifications": notifications,
            "weights": weights,
            "suppliers": suppliers,
            "orders": orders,

        }
        del connection
        return res
    except HTTPException as error:
        raise error
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        print(message)
        settings.email_client.email_admin(message, "error details:" + str(error))
        raise HTTPException(status_code=400, detail=message)


@app.get('/')
async def home():
    return '<h1>Majordomo back end</h1>'


class Weighing(BaseModel):
    container_id: int
    weight_value: float
    weighing_date: int
    last_user: int = None
    business_id: int = 1

    # def __init__(self, container_id, weight_value, weighing_date, business_id, unit=1):
    #     self.container_id = container_id
    #     self.weight_value = weight_value
    #     self.weighing_date = weighing_date
    #     self.unit = unit
    #     self.business_id = business_id


class WeighingList(BaseModel):
    weights: List[Weighing]

    # def __init__(self, weights):
    #     self.weights = weights

    def __str__(self):
        string = ""
        if self.weights:
            for weight in self.weights:
                weight = weight.dict()
                string += "\nContainer_id: " + str(weight["container_id"])
                string += "\nbusiness_id: " + str(weight["business_id"])
                string += "\nweight_value: " + str(weight["weight_value"])
                string += "\nweighing_date: " + str(weight["weighing_date"])
                string += "\nlast_user: "
                if weight["last_user"]:
                    string += str(weight["last_user"])
                else:
                    string += "no user yet "
                    string += "\n\n"
        return string


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
                query = reader.get_container_item_id_query(weight["business_id"], weight["container_id"])
                res = connection.get_result(query)

                if len(res) > 0:
                    item_id = res[0]["item_id"]
                else:
                    raise HTTPException(status_code=404, detail="Container has no item configured for this business")
                arr.insert(0, [weight_time, weight["business_id"], weight["container_id"], item_id,
                               weight["weight_value"], weight["last_user"]])

                settings.notifications_handler.update_item(weight["business_id"],
                                                           item_id, weight["container_id"],
                                                           weight["weight_value"], 1, updater)
        query, res_code = updater.insert_to_table_query("weights",
                                                        ["weighing_date", "business_id", "container_id",
                                                         "item_id", "weight_value", "last_user"],
                                                        arr)
        connection.insert_data(query, res_code)
        await manager.broadcast(f"weights updated on #{client_time}", 1)
        del connection

    except HTTPException as error:
        raise error
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        settings.email_client.email_admin("Unable to add weight", "error details:" + str(error))
        settings.log_manager.log_error(error)
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
    """add item to an order"""
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


def process_read_query(query, res_code=200):
    if res_code != 200:
        return query
    result, res_code = readQ.select_connection(query)
    if res_code == 200:
        return JSONResponse(content=jsonable_encoder(result))
    else:
        raise HTTPException(status_code=res_code, detail=result)


def process_create_query(query, res_code):
    if res_code != 200:
        return query
    result, res_code = createQ.insert_connection(query)
    if res_code == 200:
        return JSONResponse(content=jsonable_encoder(result[0]))
    else:
        raise HTTPException(status_code=res_code, detail=result)


manager = settings.web_socket_manager


@app.get('/get/wss')
async def return_socket_page():
    """socket test"""
    bla = manager.get_socket_page()
    print(str(bla))
    return HTMLResponse(manager.get_socket_page())


@app.websocket("/wss")
async def websocket_endpoint(websocket: WebSocket):
    settings.log_manager.log_debug("connection established successfully /wss")
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")


@app.websocket("/ws/{business_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, business_id: int, user_id: int):
    """create a connection with the client accessing this route"""
    settings.log_manager.log_debug("connection established successfully /ws/business_id/user_id")
    await manager.connect_socket(websocket, business_id)
    try:
        while True:
            data = await websocket.receive_text()
            # await manager.send_personal_message(f"You wrote: {data}", websocket)
            await manager.broadcast(f"Client {user_id} from {business_id} says: {data}", business_id, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket, business_id)
        # await manager.broadcast(f"Client #{user_id} left the chat")
