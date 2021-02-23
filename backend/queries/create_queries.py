from psycopg2.extras import RealDictCursor
from config import config
from functions import Functions
from db_queries import DbQueries
import psycopg2


def create():
    code, query = db_queries.add_table_code()
    code = select_connection(query)
    return str(code)


def dictionify_res(rows):
    res = []
    if type(rows) == list:
        for row in rows:
            row_data = {}
            for info in list(row):
                row_data[info] = row[info]
            res.append(row_data)
    return res

def load_dummy_data(tables_to_read, tables):
    if not tables_to_read or not tables:
        return 500
    for table in tables_to_read:
        res_code, query = db_queries.insert_to_table_query(table, tables[table]["column"], tables[table]["data"])
        res, res_code = select_connection(query,expecting_result=False)
    return res_code




def create_table_query(table_name, cols=None):
    """creates a create table query using the parameters
    input: table name: string with table name
            cols: list of lists. each list is an attribute [[column name, data type, key(optional),null/not null]...]
    output: create statement if legal parameters. None if not"""
    query = "CREATE TABLE " + table_name + "("
    if not table_name or not cols:
        return None
    for col in cols:
        for data in col:
            query += str(data) + "\t"
        query += ",\n"
    query = query[:-2] + ");"
    return 200, query


class CreateQueries:
    def __init__(self):
        pass

    @staticmethod
    def insert_connection(query, expecting_result=False):
        """this function connects with the DB and executes the query sent from the user. the result will be one of the following:
        if there is a return value: returned Sql value as a list, 200
        if not expecting result is needed it will return "processed OK", 200
        if there is a problem with query: error message, 400.
        if there is problem with the result: error message, 500"""
        conn = None
        rows = "Result not found"
        results = []
        try:
            # read connection parameters
            params = config()

            # connect to the PostgreSQL server
            print('Connecting to the PostgreSQL database...')
            conn = psycopg2.connect(**params, cursor_factory=RealDictCursor)

            # create a cursor
            cur = conn.cursor()
            print("executing query: ")
            print(query, "\n")
            if type(query) == list:
                res = {}
                for q in query:
                    cur.execute(q[0])
                    conn.commit()
                    rows = dictionify_res(cur.fetchall())
                    if rows:
                        res[q[1]] = rows
                results.append(res)
            else:
                cur.execute(query)
                conn.commit()
                rows = cur.fetchall()
                if type(rows) == list:
                    for row in rows:
                        row_data = {}
                        for info in list(row):
                            row_data[info] = row[info]
                        results.append(row_data)

        except (Exception, psycopg2.DatabaseError) as error:
            print("error: ", error)
            return error, 400

        finally:
            if conn is not None:
                # close the communication with the PostgreSQL
                conn.close()
                print('Database connection closed.')
                if expecting_result:
                    if results:
                        print("res:", results)
                        return results, 200
                    else:
                        return "Result not found", 200
                else:
                    return "processed OK", 200
            return rows, 500

    @staticmethod
    def insert_to_table_query(table_name, cols, values):
        """creates a insert SQL query using the parameters
            input: table name: string with table name
                    cols: list of column names.
                    values: list of lists: [[col1 val,  col2 val,....],[...]]
            output: insert statement if legal parameters. None if not"""
        if not table_name or not cols or not values:
            return None
        num_of_cols = len(cols)
        query = "INSERT INTO " + table_name + " ("
        for col in cols:
            query += col + ", "
        query = query[:-2]
        query += ") \nVALUES ("
        entered_loop = False
        for value in values:
            if len(value) != num_of_cols:
                continue
            for val in value:
                entered_loop = True
                if type(val) == str and "to_timestamp" not in val:
                    query += "'" + val + "', "
                else:
                    if not val and val != 0:
                        query += "null, "
                    else:
                        query += str(val) + ", "
            query = query[:-2] + "),\n("
        query = query[:-3] + ";"
        if entered_loop:
            return query, 200
        else:
            return "Bad request", 400
