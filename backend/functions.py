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
    return "<h1>" + code + "</h1><p>" + message + "</p>" , code


@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p>", 404


@app.route('/', methods=['GET'])
def home():
    return '''<h1>Distant Reading Archive</h1>
<p>A prototype API for distant reading of science fiction novels.</p>'''


@app.route('/get/weights', methods=['GET'])
def get_shlomo_data():
    list_of_cols = ["a", "b", "c"]

    query_arguments = phrase_parameters(request.args)


    return ask_db(db_queries.select_query(query_arguments))


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

def create_proj_tables(a,b):
    return 200,(db_queries.create_table_query("weights",
                                        [["container_id", "varchar(10)", "NOT NULL"],
                                         ["weighing_time", "date", "NOT NULL"],
                                         ["weight_value", "varchar(10)", "NOT NULL"]]))



def ask_db(func, args, extra_args,expecting_result=False):
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

        res_code, query = func(args, extra_args)
        if res_code == 200:
            cur.execute(query)
#
            conn.commit()
            if expecting_result:
                rows = cur.fetchall()
                if rows:
                    print(rows)
        else:
            conn.close()
            print('Database connection closed.')
            return error_message(res_code, query)

    except (Exception, psycopg2.DatabaseError) as error:
        print("error: ", error)
    finally:
        if conn is not None:
            # close the communication with the PostgreSQL
            conn.close()
            print('Database connection closed.')
            if expecting_result:
                return jsonify(rows)
            else:
                return None
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
    # create_proj_tables()
