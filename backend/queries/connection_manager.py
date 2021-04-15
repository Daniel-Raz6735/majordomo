import psycopg2
from psycopg2.extras import RealDictCursor
from config import config
from fastapi import HTTPException


class Connection:
    """The Connection class is a class that opens a connection with the DB and executes requests
    for classes that created it
    self contains : conn - the connection to the DB.
                    cur - the connection cursor"""

    def __init__(self):
        """establish a connection with the DB"""
        # DB connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        self.conn = psycopg2.connect(**params, cursor_factory=RealDictCursor)

        # create a cursor
        self.cur = self.conn.cursor()

    def __del__(self):
        """close the class connection"""
        if self.conn is not None:
            # close the communication with the PostgreSQL
            self.conn.close()
            print('Database connection closed.')
            self.conn = None
            self.cur = None

    def get_result(self, query):
        """execute query and returns its result
           output: a list of dicts: [{col name: value,col2 name: value...},{...}...]"""
        try:
            self.cur.execute(query)
            res = dictionify_res(self.cur.fetchall())
            return res

        except (Exception, psycopg2.DatabaseError) as error:
            print("error: ", error)
            return error, 400

    def execute_query(self, query, error_message):
        """execute an sql query query"""
        try:
            print(query)
            self.cur.execute(query)
            self.conn.commit()

        except (Exception, psycopg2.DatabaseError) as error:
            print("error: ", error)
            raise HTTPException(status_code=400, detail=error_message)

    def insert_data(self, insert_query, error_message, update_query=None, conflict_fields=None):
        """executes an insert data query. provided an update query it will update the values if their is a conflict
        in the conflict fields
        input: sql query, error message if query is un successful, sql query, list of field names that are tested for conflict """
        if update_query:
            fields = "("
            colon = ""
            for field in conflict_fields:
                fields += colon + field
                colon = ", "
            fields += ")"
            full_query = insert_query[:-1] + " ON CONFLICT " + fields + " DO " + update_query
        else:
            full_query = insert_query
        try:
            print(full_query)
            self.cur.execute(full_query)
            self.conn.commit()
            return "success", 200

        except (Exception, psycopg2.DatabaseError) as error:
            print("error: ", error)
            raise HTTPException(status_code=400, detail=error_message)


def init_connection():
    """initiate a connection with the DB"""
    # DB connection parameters
    params = config()

    # connect to the PostgreSQL server
    print('Connecting to the PostgreSQL database...')
    conn = psycopg2.connect(**params, cursor_factory=RealDictCursor)

    # create a cursor
    cur = conn.cursor()
    return conn, cur


def dictionify_res(rows):
    """ convert a RealDictCursor dict to a regular python list of dicts
        output: [{col name: value,col2 name: value...},{...}...] """
    res = []
    if type(rows) == list:
        for row in rows:
            row_data = {}
            for info in list(row):
                row_data[info] = row[info]
            res.append(row_data)
    return res
