from queries.connection_manager import Connection
# def drop_table_query(table_name):
#     return 200, "DROP TABLE " + table_name + " CASCADE;"


# def drop_tables():
#     if not tables_to_read:
#         return "500"
#     for table in tables_to_read:
#         res_code, query = db_queries.drop_table_query(table)
#         select_connection(query)
#     return "200"


class DeleteQueries:
    def __init__(self, connection=False):
        if not connection:
            connection = Connection()
        self.connection = connection

