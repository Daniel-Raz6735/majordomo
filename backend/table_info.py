tables = {
    "users": {
        "column":["user_id", 'first_name', 'last_name', "email", "address", "phone_number", "department_id"],
        "data":[
        [1, 'Shlomo', 'Carmi', "test@gmail.com", "some were pl NY", "0541234567", 1],
        [2, 'Daniel', 'Raz', "tester@gmail.com", "The good place, JLM", "0509876541", 1],
        [3, 'Some', 'One', "someone@gmail.com", "place, JLM", "0511111111", 2],
        [4, 'Jon', 'Doe', "jondoe@gmail.com", "jhons place, JLM", "0502002121", 3],
        [5, 'vegetable', 'seller', "vegetables@gmail.com", "vegetables place, JLM", "0502001231", None],
        [6, 'fruit', 'seller', "fruit@gmail.com", "fruits place, JLM", "0502465661", None],
        [7, 'meet', 'seller', "meet@gmail.com", "meets place, JLM", "0522465661", None]
        ]
    },
    "supplier": {
        "column": ["supplier_id", "client_id", 'item_id', 'days_to_provide', "preferred_contact"],
        "data":[
        [5, 1, 1, '1110000', "email"],
        [5, 2, 1, '1110000', "email"],
        [5, 2, 2, '1110110', "email"],
        [6, 1, 2, '1000000', "email"],
        [6, 2, 2, '1000000', "email"],
        [7, 1, 1, '0001000'],
        [7, 2, 1, '0001000']
        ]
    },
    "food_items": {
        "column":["item_id", 'item_name'],
        "data":[
            [1, "tomato"],
            [2, "cucumber"],
            [3, "apple"],
            [4, "pear"],
            [5, "Beef"],
            [6, "Turkey meat"],
            [7, "chicken"]
        ]
    },
    "client": {
         "column": ["client_id","admin","client_name"],
         "data": [
            [1, 2, "hotel one"],
            [2, 4, "cool restaurant"]
            ]
    },
    "department": {
            "column": ["department_id", "client_id", "department_name"],
            "data": [
                    [1, 1, "restaurant"],
                    [2, 1, "room service"],
                    [3, 2, "main hall"]

                    ]
    },
    "worker": {
         "column": ["worker_id", "department_id"],
         "data": [
            [1, 1],
            [2, 1],
            [3, 2],
            [4, 3]
            ]
    },
    "orders": {
      "column": ["order_id", "order_date", "order_creator_id", "client_id",  "supplier_id", "price"],
      "data": [
                [1, '2014-10-19 10:23:54', 1, 2, 5, None],
                [2, '2014-10-19 10:24:00', 1, 2, 6, 25.5],
                [3, '2014-10-21 10:25:34', 1, 2, 5, None]
      ]
    },
    "order_content": {
         "column": ["order_id", "item_id", "price_per_unit", "amount", "unit"],
         "data": [
             ["order_id", "item_id", "price_per_unit", "amount", "unit"],
             [1, 1, 4.2, 30, "kg"],
             [1, 2, 4.3, 25, "kg"],
             [2, 3, 4, 12, "kg"],
             [2, 4, 5, 15, "kg"],
             [3, 1, 4.2, 17, "kg"],
             [3, 2, 4.3, 18, "kg"],
            ]
    },
    "recipes": {
         "column": ["recipe_id", "client_id", "recipe_name"],
         "data": [
                [1, 1, "regular salad"],
                [2, 1, "apple pear compote"],
                [3, 2, "regular salad"],
                [4, 2, "fried chicken"],
                ]
    },
    "recipe_content": {
        "column": ["recipe_id", "item_id", "amount", "unit"],
        "data": [
            [1,1,0.5,"kg"],
            [1,2,0.5,"kg"],
            [2,3,0.6,"kg"],
            [2,4,0.4,"kg"],
            [3,1,0.4,"kg"],
            [3,2,0.4,"kg"],
            [4,1,1,"kg"],
            ]
    },
    "containers": {
        "column": ["container_id", "using_start_date", "item_id", "client_id"],
        "data": [
        [4, '2014-10-19 10:23:54', 21, 50],
        [5, '2014-10-19 10:23:54', 22, 50],
        [6, '2014-10-19 10:23:54', 25, 2]
        ]
    },
    "weights": {
        "column":["container_id","weighing_date", "last_user", "weight_value"],
        "data":[
        [1, '2004-10-19 10:23:54', 4],
        [1, '2004-10-20 10:23:54', 3],
        [1, '2004-10-21 10:23:54', 2],
        [1, '2004-10-22 10:23:54', 2.5],
        [2, '2004-10-23 10:23:54', 4.5],
        [2, '2004-10-24 10:23:54', 3.5],
        [2, '2004-10-25 10:23:54', 2.5],
        [2, '2004-10-26 10:23:54', 2.5],
        [3, '2004-10-27 10:23:54', 4.9],
        [3, '2004-10-28 10:23:54', 3.9],
        [3, '2004-11-19 10:23:54', 2.9],
        [3, '2004-12-19 10:23:54', 2.9],
    ]
    },

}

