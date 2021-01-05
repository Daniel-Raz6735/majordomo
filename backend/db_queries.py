

def create_table_query(table_name, cols,bull_val):
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
                query += str(val) + ", "
        query = query[:-2] + "),\n("
    query = query[:-3] + ";"
    if entered_loop:
        return 200, query
    else:
        return 400, "Bad request"


def select_query(tables, columns_per_table, conditions):
    """creates a select sql query
        expected input: tables =[table1,table2...]
                        columns = [[table 1 column names[column name, column nick]...]...]
                        conditions [[string containing the condition and/not/or, var1, condition, var2]...]
        expected output: sql query if all parameters legal None if not"""
    if columns_per_table:
        columns_len = len(columns_per_table)
    else:
        columns_len = 0
    query = "SELECT "
    if not columns_per_table or columns_len != len(tables):
        query += "* "
    else:
        for i in range(columns_len):
            for col in columns_per_table[i]:
                query += tables[i] + "."
                try:
                    query += col[0] + " AS " + col[1] + ", "
                except IndexError:
                    query += col[0] + ", "

        query = query[:-2]

    query += "\nFROM "
    for table in tables:
        query += table + ","
    query = query[:-1]
    if conditions:
        query += "\nWHERE "
        for i in range(len(conditions)):
            condition = conditions[i]
            if len(condition) == 4:
                if i == 0:
                    first = condition.pop(0).lower()

                    if first == "not" or first == "or not" or first == "and not":
                        condition.insert(0, "NOT")
                for cond in condition:
                    query += str(cond) + " "
            if i != len(conditions):
                query += " \n\t\t"
    return 200, query + ';'
