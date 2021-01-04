

def create_table(table_name, keys, cols):

    query = "CREATE TABLE " + table_name
    for key in keys:
        query += "\n"
        for data in key:
            query += "\t" + data
    for col in cols:
        query += "\n"
        for data in col:
            query += "\t" + data
    return query
