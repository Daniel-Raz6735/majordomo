import flask
from flask import request, jsonify
import psycopg2
from config import config
import db_queries

app = flask.Flask(__name__)
app.config["DEBUG"] = True


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


def phrase_parameters(params):
    query_parameters = []
    non_used_params = []
    for param in params:
        # id = query_parameters.get('id')
        # to_filter = []
        # info = [123, "new person", "dan", "hat", "City"]
        print(param)

        query_parameters.append([param[0], param[1]])
        # info[0] = id
    return query_parameters


def error_message(code, message):
    return "<h1>" + code + "</h1><p>" + message + "</p>", code


@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p>", 404


@app.route('/', methods=['GET'])
def home():
    return '''<h1>Distant Reading Archive</h1>
<p>A prototype API for distant reading of science fiction novels.</p>'''


@app.route('/get/weights', methods=['GET'])
def get_weights_data():
    list_of_cols = ["a", "b", "c"]
    # create_proj_tables()
    # query_arguments = phrase_parameters(request.args)
    load_dummy_data()
    # return ask_db(db_queries.select_query(query_arguments))
    return '''<h1>Distant Reading Archive</h1>
       <p>A prototype API for distant reading of science fiction novels.</p>'''

# @app.route('/api', methods=['GET'])
# def api_filter():
#     conn = None
#     rows = ""
#     try:
#         # read connection parameters
#         params = config("postgres")
#
#         # connect to the PostgreSQL server
#         print('Connecting to the PostgreSQL database...')
#         conn = psycopg2.connect(**params)
#
#         # create a cursor
#         cur = conn.cursor()
#         query_parameters = request.args
#         id = query_parameters.get('id')
#         to_filter = []
#         info = [123, "new person", "dan", "hat", "City"]
#
#         if id:
#             to_filter.append(["PersonID", id])
#             info[0] = id
#         # else:
#         #     return page_not_found(404)
#
#         # create_table
#         # for key in tables:
#         #     cur.execute(db_queries.create_table(key, tables[key]["keys"], tables[key]["cols"]))
#         #     print("adding table : ", key,tables[key]["keys"],tables[key]["cols"])
#         # conn.commit()
#
#
#         # add more data
#         # cur.execute(db_queries.insert_to_table("shlomo", info))
#         # conn.commit()
#
#
#         # cur.execute("SELECT * from shlomo")
#         cur.execute(db_queries.read_info_from_db("shlomo", ["PersonID", "FirstName", "LastName", "City"], to_filter))
#         rows = cur.fetchall()
#         print(rows)
#         #
#
#
#         # conn = sqlite3.connect('books.db')
#         # conn.row_factory = dict_factory
#         # cur = conn.cursor()
#         # results = cur.execute(query, to_filter).fetchall()
#
#     except (Exception, psycopg2.DatabaseError) as error:
#             print(error)
#     finally:
#         if conn is not None:
#             # close the communication with the PostgreSQL
#             conn.close()
#             print('Database connection closed.')
#             return jsonify(rows)


def load_dummy_data():
    weight_columns = ["container_id", "weighing_time", "weight_value"]
    weight_data = [
                    [1, 1609795520, 4],
                    [1, 1609795603, 3],
                    [1, 1609795611, 2],
                    [1, 1609795620, 2.5],
                    [2, 1609795520, 4.5],
                    [2, 1609795603, 3.5],
                    [2, 1609795611, 2.5],
                    [2, 1609795620, 2.5],
                    [3, 1609795520, 4.9],
                    [3, 1609795603, 3.9],
                    [3, 1609795611, 2.9],
                    [3, 1609795620, 2.9],
    ]
    ask_db(db_queries.insert_to_table_query,"weights",weight_columns,weight_data)

    containers_columns = ["container_id", "using_start_date", "item_id", "client_id"]
    containers_data = [
                        [1, 1578172837, 21, 50],
                        [2, 1578172837, 22, 50],
                        [3, 1578172837, 25, 2]]
    # db_queries.insert_to_table_query("containers", containers_columns,containers_data)
    ask_db(db_queries.insert_to_table_query,"containers",containers_columns,containers_data)

# container_vars = [["container_id", "varchar(10)", "NOT NULL"],
#                   ["using_start_date", "date", "NOT NULL"],
#                   ["item_id", "int", "NULL"],
#                   ["client_id", "int", "NULL"]
#                   ]

def create_proj_tables():
    weight = db_queries.create_table_query("weights",
                                           [["container_id", "varchar(10)", "NOT NULL"],
                                            ["weighing_time", "date", "NOT NULL"],
                                            ["weight_value", "double", "NOT NULL"]])

    weights_vars =[["container_id", "int", "NOT NULL"],
                                            ["weighing_time", "date", "NOT NULL"],
                                            ["weight_value", "double", "NOT NULL"]]

    container_vars = [["container_id", "int", "NOT NULL"],
                      ["using_start_date", "date", "NOT NULL"],
                      ["item_id", "int", "NULL"],
                      ["client_id", "int", "NULL"]
                      ]
    ask_db(db_queries.create_table_query, "containers", container_vars)
    ask_db(db_queries.create_table_query, "weights", weights_vars)


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
            cur.execute(query)
            print("query: ")
            print(query)
            conn.commit()
            if expecting_result:
                rows = cur.fetchall()
                if rows:
                    print(rows)
        else:
            conn.close()
            print(res_code, 'Database connection closed.')
            if expecting_result:
                return error_message(res_code, query)

    except (Exception, psycopg2.DatabaseError) as error:
        print("error: ", error)
    finally:
        if conn is not None:
            # close the communication with the PostgreSQL
            conn.close()
            print(res_code, 'Database connection closed.')
            if expecting_result:
                return jsonify(rows)
        return '''<h1>Distant Reading Archive</h1>
           <p>A prototype API for distant reading of science fiction novels.</p>'''

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


# def connect():
#     """ Connect to the PostgreSQL database server """
#     conn = None
#     try:
#         # read connection parameters
#         params = config()
#
#         # connect to the PostgreSQL server
#         print('Connecting to the PostgreSQL database...')
#         conn = psycopg2.connect(**params)
#
#         # create a cursor
#         cur = conn.cursor()
#         for key in tables:
#             cur.execute(db_queries.create_table(key, tables[key]["keys"], tables[key]["cols"]))
#         conn.commit()
#         cur.execute(db_queries.)
#
#
#         conn.commit()
#
#         cur.execute("SELECT * from shlomo")
#         rows = cur.fetchall()
#         print(rows)
#
#
#
#         # close the communication with the PostgreSQL
#         cur.close()
#     except (Exception, psycopg2.DatabaseError) as error:
#         print(error)
#     finally:
#         if conn is not None:
#             conn.close()
#             print('Database connection closed.')


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

if __name__ == '__main__':
    # create_proj_tables()
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
