
def create():
    code, query = db_queries.add_table_code()
    code = select_connection(query)
    return str(code)


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
