import psycopg2
from config import config

def create_table(table_name, keys, cols):

    query = "CREATE TABLE " + table_name +"("
    for key in keys:
        query += "\n"
        for data in key:
            query += "\t" + data
        query += ","
    for col in cols:
        query += "\n"
        for data in col:
            query += "\t" + data
        query += ","
    query = query[:-1]

    return query + ")"


def connect():
    """ Connect to the PostgreSQL database server """
    conn = None
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()
        # for key in tables:
        #     cur.execute(create_table(key, tables[key]["keys"], tables[key]["cols"]))
        # conn.commit()
        # print("table created succseful")
        cur.execute(
            "INSERT INTO SHLOMO (PersonID,FirstName,LastName,Address,City ) VALUES (3420, 'John', 'Maclein', 'Computer Science', 'ICT')")

        conn.commit()

        cur.execute("SELECT * from shlomo")
        rows = cur.fetchall()
        print(rows)



        # close the communication with the PostgreSQL
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')


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

if __name__ == '__main__':
    connect()

