

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

def insert_to_table(table_name, vals):
    query = "INSERT INTO " + table_name +  " (PersonID,FirstName,LastName,Address,City ) VALUES ("
    for val in vals:
        query += val+", "
    query += ");"
    return query


def read_info_from_db(table_name, columns, conditions):
    query = "SELECT "
    if not columns:
        query += "* "
    else:
        for col in columns:
            query += col + " ,"
        query = query[:-1]

    query += "FROM " + table_name
    if conditions:
        query += "\nWHERE "
        for condition in conditions:
            query += condition[0] + " = " + condition[1] + "AND"
        # remove last and
        query = query[:-4]

    query += ';'
