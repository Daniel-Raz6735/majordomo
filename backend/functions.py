import flask
from flask import request, jsonify
import sqlite3
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


@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p>", 404

@app.route('/', methods=['GET'])
def home():
    return '''<h1>Distant Reading Archive</h1>
<p>A prototype API for distant reading of science fiction novels.</p>'''



@app.route('/api', methods=['GET'])
def api_filter():
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
        query_parameters = request.args
        id = query_parameters.get('id')
        to_filter = []

        if id:
            to_filter.append(["PersonID", id])
        # else:
        #     return page_not_found(404)

        # create_table
        # for key in tables:
        #     cur.execute(db_queries.create_table(key, tables[key]["keys"], tables[key]["cols"]))
        #     print("table added: ", key,tables[key]["keys"],tables[key]["cols"])
        # conn.commit()


        # add more data
        # cur.execute(db_queries.insert_to_table("shlomo", info))
        # cur.execute("INSERT INTO SHLOMO (PersonID,FirstName,LastName,Address,City) VALUES (123, 'John', '18', 'Computer Science', 'ICT')")
        # print("commit?")
        # conn.commit()
        # print("here?")

        cur.execute("SELECT * from shlomo")
        # cur.execute(db_queries.read_info_from_db("shlomo", ["PersonID", "FirstName", "LastName", "Address", "City"], to_filter))
        rows = cur.fetchall()
        print(rows)


        # conn = sqlite3.connect('books.db')
        # conn.row_factory = dict_factory
        # cur = conn.cursor()
        # results = cur.execute(query, to_filter).fetchall()

    except (Exception, psycopg2.DatabaseError) as error:
            print(error)
    finally:
        if conn is not None:
            # close the communication with the PostgreSQL
            conn.close()
            print('Database connection closed.')
            return jsonify(rows)




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
info =[123, "daniel", "ca", "blabal", "City"]


if __name__ == '__main__':
    app.run()

