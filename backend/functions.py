import flask
from flask import request, jsonify
import psycopg2
from config import config
import db_queries
from flask_cors import CORS
import table_info

app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


def load_dummy_data(tables_to_read, tables):
    if not tables_to_read or not tables:
        return 500
    for table in tables_to_read:
        ask_db(db_queries.insert_to_table_query, table, tables[table]["column"], tables[table]["data"])
    return 200


def ask_db(func, args=None, extra_args=None, more_args=None, even_more_args=None,expecting_result=False):
    conn = None
    rows = ""
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        res_code, query = func(args, extra_args, more_args, even_more_args)
        if res_code == 200:
            print("executing query: ")
            print(query)
            cur.execute(query)
            conn.commit()
            if expecting_result:
                rows = cur.fetchall()
                if rows:
                    print("info received:", rows)
        else:
            conn.close()
            print(res_code, 'Database connection closed.\nwrong query')
            if expecting_result:
                return error_message(res_code, query)

    except (Exception, psycopg2.DatabaseError) as error:
        print("error: ", error)
        if expecting_result:
            return error

    finally:
        if conn is not None:
            # close the communication with the PostgreSQL
            conn.close()
            # print(res_code, 'Database connection closed.')
            if expecting_result:
                return jsonify(rows)
        return '''<h1>Distant Reading Archive</h1>
           <p>A prototype API for distant reading of science fiction novels.</p>'''


def phrase_parameters(params, used_params):
    query_parameters = []
    non_used_params = []
    print(params)
    for param in params:
        # id = query_parameters.get('id')
        # to_filter = []
        # info = [123, "new person", "dan", "hat", "City"]
        p = params.get(param)
        if param in used_params:
            query_parameters.append([param, p])
        else:
            non_used_params.append([param, p])
    return query_parameters, non_used_params


def error_message(code, message):
    return "<h1>" + code + "</h1><p>" + message + "</p>", code


@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p>", 404


@app.route('/', methods=['GET'])
def home():
    return '''<h1>Distant Reading Archive</h1>
<p>A prototype API for distant reading of science fiction novels.</p>'''


@app.route('/get/containers', methods=['GET'])
def get_weights_data():
    list_of_cols = ["container_id", "client_id"]
    used_p, non_used_p = phrase_parameters(request.args, list_of_cols)
    conditions = []
    for cond in used_p:
        if cond[0] == "client_id":
            conditions.append(["AND", "client_id", "=", int(cond[1])])
        elif cond[0] == "container_id":
            conditions.append(["AND", "containers.container_id", "=", int(cond[1])])
            conditions.append(["AND", "weights.container_id", "=", "containers.container_id"])

    conditions.append(["AND", "food_items.item_id", "=", "containers.item_id"])
    res = ask_db(db_queries.select_query, ["containers", "weights", "food_items"],
                 [[["container_id"]], [["weight_value", "weight"]], [["item_name"]]],
                 conditions, [ "weight","containers.container_id","food_items.item_name"], expecting_result=True)
    return res


@app.route('/get/restart', methods=['GET'])
def restart_tables():
    drop_tables()
    print("*****************removed********************")
    code = ask_db(db_queries.add_table_code)
    return str(code)


@app.route('/get/create', methods=['GET'])
def create():
    code = ask_db(db_queries.add_table_code)
    return str(code)


@app.route('/get/drop/all', methods=['GET'])
def drop_tables():
    tables_to_read = [
        "users",
        "supplier",
        "food_items",
        "client",
        "department",
        "worker",
        "orders",
        "order_content",
        "recipes",
        "recipe_content",
        "containers",
        "weights"
    ]
    if not tables_to_read:
        return "500"
    for table in tables_to_read:
        ask_db(db_queries.drop_table_query, table)
    return "200"


@app.route('/get/add/dummy_data', methods=['GET'])
def add_dummy():
    tables_to_read = [
        "users",
        "client",
        "food_items",
        "supplier",
        "department",
        "worker",
        "orders",
        "order_content",
        "recipes",
        "recipe_content",
        "containers",
        "weights"
    ]
    res = load_dummy_data(tables_to_read, table_info.tables)
    return str(res)


def tests():
    conditions = [["AND", "client_id", "=", 1],
                  ["AND", "containers.container_id", "=", int(1)],
                  ["AND", "weights.container_id", "=", "containers.container_id"],
                  ["AND", "food_items.item_id", "=", "containers.item_id"]]
    res = db_queries.select_query(["containers", "weights", "food_items"],
                 [[["container_id"]], [["weight_value", "weight"]], [["item_name"]]], conditions,["container_id", "weight"])
    if res[0] == 200 and res[1] == """SELECT containers.container_id, weights.weight_value AS weight, food_items.item_name
FROM containers, weights, food_items
WHERE  client_id  =  1 ,  AND  containers.container_id  =  1 ,  AND  weights.container_id  =  containers.container_id ,  AND  food_items.item_id  =  containers.item_id ;""":
        print("passed select test")
    else:
        print("failed select test")
    print(res[1])



if __name__ == '__main__':
    app.run()
    # tests()

def create_proj_tables():
    weights_vars = [
        ["container_id", "int", "NOT NULL"],
        ["weighing_time", "timestamp", "NOT NULL"],
        ["weight_value", "real", "NOT NULL"]
    ]

    containers_vars = [["container_id", "int", "NOT NULL"],
                       ["using_start_date", "timestamp", "NOT NULL"],
                       ["item_id", "int", "NULL"],
                       ["client_id", "int", "NULL"]
                       ]

    ask_db(db_queries.create_table_query, "weights", weights_vars)
    ask_db(db_queries.create_table_query, "containers", containers_vars)


