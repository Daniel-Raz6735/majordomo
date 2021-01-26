

def add_dummy():

    res = load_dummy_data(tables_to_read, table_info.tables)
    return select_connection(res, False)




def load_dummy_data(tables_to_read, tables):
    if not tables_to_read or not tables:
        return 500
    for table in tables_to_read:
        res_code, query = db_queries.insert_to_table_query(table, tables[table]["column"], tables[table]["data"])
        res, res_code = select_connection(query,expecting_result=False)
    return res_code


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
            if type(val) == str:
                query += "'" + val + "', "
            else:
                if not val:
                    query += "null, "
                else:
                    query += str(val) + ", "
        query = query[:-2] + "),\n("
    query = query[:-3] + ";"
    if entered_loop:
        return 200, query
    else:
        return 400, "Bad request"


class UpdateQueries:
    def __init__(self):
        pass

