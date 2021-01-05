import flask
from flask import request, jsonify
import psycopg2
from config import config
import db_queries
from flask_cors import CORS


app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


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
    return query_parameters,non_used_params


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
    list_of_cols = ["container_id"]
    # create_proj_tables()
    # load_dummy_data()
    used_p, non_used_p = phrase_parameters(request.args, list_of_cols)
    conditions = []
    # for lis in used_p:
    #     conditions.append(["AND", lis[0], "=", lis[1]])
    # print(conditions)
    res = ask_db(db_queries.select_query, ["containers"], conditions,expecting_result=True)
    return res



    # return ask_db(db_queries.select_query(query_arguments))



def load_dummy_data():
    weight_columns = ["container_id", "weighing_time", "weight_value"]
    weight_data = [
                    [1, '2004-10-19 10:23:54', 4],
                    [1, '2004-10-20 10:23:54', 3],
                    [1, '2004-10-21 10:23:54', 2],
                    [1, '2004-10-22 10:23:54', 2.5],
                    [2, '2004-10-23 10:23:54', 4.5],
                    [2, '2004-10-24 10:23:54', 3.5],
                    [2, '2004-10-25 10:23:54', 2.5],
                    [2, '2004-10-26 10:23:54', 2.5],
                    [3, '2004-10-27 10:23:54', 4.9],
                    [3, '2004-10-28 10:23:54', 3.9],
                    [3, '2004-11-19 10:23:54', 2.9],
                    [3, '2004-12-19 10:23:54', 2.9],
    ]
    # ask_db(db_queries.insert_to_table_query, "weights", weight_columns, weight_data)

    containers_columns = ["container_id", "using_start_date", "item_id", "client_id"]
    containers_data = [
                        [4, '2014-10-19 10:23:54', 21, 50],
                        [5, '2014-10-19 10:23:54', 22, 50],
                        [6, '2014-10-19 10:23:54', 25, 2]]
    ask_db(db_queries.insert_to_table_query, "containers", containers_columns, containers_data)


def create_proj_tables():


    weights_vars =[["container_id", "int", "NOT NULL"],
                                            ["weighing_time", "timestamp", "NOT NULL"],
                                            ["weight_value", "real", "NOT NULL"]]

    container_vars = [["container_id", "int", "NOT NULL"],
                      ["using_start_date", "timestamp", "NOT NULL"],
                      ["item_id", "int", "NULL"],
                      ["client_id", "int", "NULL"]
                      ]
    ask_db(db_queries.create_table_query, "weights", weights_vars)
    ask_db(db_queries.create_table_query, "containers", container_vars)


def ask_db(func, args, extra_args, more_args=None, expecting_result=False):
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
        print(args, extra_args)
        res_code, query = func(args, extra_args,more_args)
        if res_code == 200:
            print("executing query: ")
            print(query)
            cur.execute(query)
            conn.commit()
            if expecting_result:
                rows = cur.fetchall()
                if rows:
                    print("info received:", (rows))
        else:
            conn.close()
            print(res_code, 'Database connection closed.')
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
            print(res_code, 'Database connection closed.')
            if expecting_result:
                return jsonify(rows)
        return '''<h1>Distant Reading Archive</h1>
           <p>A prototype API for distant reading of science fiction novels.</p>'''


if __name__ == '__main__':
    app.run()





# usage examples
# print(db_queries.select_query(  ["shlomo", "daniel"],
#                                 [[["a", "b"], ["c"]], [["d"]]],
#                                 [["and not",  "b", " = ", "d"],
#                                  ["and","c",">","d"],
#                                  ["or","c",">","d"]]))
# print(db_queries.insert_to_table_query("shlomo", ["a", "b", "c"],
#                                        [["a1", "b1", "c1", "d1"],
#                                         ["a2", "b2", "c2"],
#                                         ["a3", 3, 3],
#                                         ["a4", "b4", "c4"]]))
# print(db_queries.create_table_query("shlomo",
#                                     [["a", "int", "PRIMARY KEY", " NOT NULL"],
#                                      ["b", "varchar(20)", " NULL"],
#                                      ["c", "varchar(20)", " NULL"]]))
# ask_db(create_proj_tables, None, None)
        # create_table
        # for key in tables:
        #     cur.execute(db_queries.create_table(key, tables[key]["keys"], tables[key]["cols"]))
        #     print("adding table : ", key,tables[key]["keys"],tables[key]["cols"])
        # conn.commit()

        # add more data
        # cur.execute(db_queries.insert_to_table("shlomo", info))
        # conn.commit()

        # cur.execute("SELECT * from shlomo")
        # cur.execute(
        #     db_queries.read_info_from_db("shlomo", ["PersonID", "FirstName", "LastName", "City"], to_filter))

        #

        # conn = sqlite3.connect('books.db')
        # conn.row_factory = dict_factory
        # cur = conn.cursor()
        # results = cur.execute(query, to_filter).fetchall()


tables = {
    "shlomo": {
        "keys": [["PersonID", "int"]],
        "cols": [
            ["FirstName", "varchar(255)"],
            ["LastName", "varchar(255)"],
            ["Address", "varchar(255)"],
            ["City", "varchar(255)"],
        ]
    }
}

# info =[PersonID, FirstName, LastName, Address, City]
