from queries.connection_manager import Connection
from db_queries import DbQueries


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

    def remove_order_item(self, order_id, item_id, business_id):
        """remove an item from an order based on order id"""
        conditions = [["AND", "order_content.item_id", "=", int(item_id)],
                      ["AND", "order_content.order_id", "=", int(order_id)]]
        return self.remove_row("order_content", conditions)
        pass

    @staticmethod
    def remove_row(table_name, conditions):
        """creates a delete SQL query using the parameters
            input: table name: string with table name
                    conditions: list of lists containing the conditions to remove rows
            """
        if not table_name:
            return None
        query = "DELETE FROM " + table_name
        where = DbQueries.condition_creator(conditions)
        if where is not None:
            query += "  WHERE " + where
        query + "; "
        return query
