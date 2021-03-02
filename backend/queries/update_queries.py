

def add_dummy():

    res = load_dummy_data(tables_to_read, table_info.tables)
    return select_connection(res, False)




class UpdateQueries:
    def __init__(self):
        pass

    @staticmethod
    def add_order_item(item):
        conditions = []
        conditions =["AND", "orders.business_id", "=", int(args["business_id"])]
        # else:
        #     return error_message(400, "Bad request", "no business id sent"), 400

        if "item_ids" in args:
            and_or = "AND"
            items = args["item_ids"]
            for item in items:
                conditions.append([and_or, "supplier.item_id", "=", int(item)])
                and_or = "OR"

        conditions.append(["AND", "supplier.supplier_id", "=", "users.user_id"])

        final_query, res_code = DbQueries.select_query(
            ["supplier", "users"],
            None,
            conditions)
        if res_code != 200:
            return error_message(res_code, final_query), 400
        return final_query, 200

