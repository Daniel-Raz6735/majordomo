tables = {
    "users": {
        "column": ["user_id", 'first_name', 'last_name', "email_user_name", "email_domain_name", "address",
                   "phone_number", "business_id", "department_id"],
        "data": [
            [1, 'Shlomo', 'Carmi', "shlomow6", "gmail.com", "some were pl NY", "0541234567", 1, 1],
            [2, 'Daniel', 'Raz', "tester", "gmail.com", "The good place, JLM", "0509876541", 1, 1],
            [3, 'Some', 'One', "someone", "gmail.com", "place, JLM", "0511111111", 2, 3],
            [4, 'Jon', 'Doe', "jondoe", "gmail.com", "jhons place, JLM", "0502002121", 3, 3],
            [5, 'vegetable', 'seller', "vegetables", "gmail.com", "vegetables place, JLM", "0502001231", None, None],
            [6, 'fruit', 'seller', "fruit", "gmail.com", "fruits place, JLM", "0502465661", None, None],
            [7, 'meet', 'seller', "meet", "gmail.com", "meets place, JLM", "0522465661", None, None],
            [10, 'fish', 'seller', "fish", "gmail.com", "fishs place, JLM", "0522465661", None, None],
            [8, 'milk', 'seller', "milk", "gmail.com", "milks place, JLM", "0522434551", None, None],
            [9, 'pasta', 'seller', "pasta", "gmail.com", "pasta place, JLM", "0542147576", None, None]
        ]
    },
    "user_preference": {
        "column": ["user_id", "lang"],
        "data": [
            [1, "HE"],
            [2, "EN"],
            [3, "HE"],
            [4, "HE"],
            [5, "HE"],
            [6, "HE"],
            [7, "HE"]
        ]
    },
    "supplier": {
        "column": ["supplier_id", "business_id", 'item_id', 'days_to_provide', "preferred_contact", "frequency"],
        "data": [
            [5, 1, 1, '1110000', 'email', 'daily'],
            [5, 1, 2, '1110000', 'email', 'daily'],
            [6, 1, 2, '1000000', 'email', 'daily'],
            [6, 1, 3, '1000000', 'email', 'daily'],
            [6, 1, 4, '1000000', 'email', 'daily'],
            [7, 1, 5, '0001000', None, 'monthly'],
            [7, 1, 6, '0001000', None, 'monthly'],
            [7, 1, 7, '0001000', None, 'monthly'],
            [10, 1,8, '0001000', None, 'monthly'],
            [8, 1,9, '0001000', None, 'monthly'],



            [5, 2, 1, '1110000', 'email', 'daily'],
            [5, 2, 2, '1110110', 'email', 'daily'],
            [6, 2, 2, '1000000', 'email', 'daily'],
            [7, 2, 6, '0001000', None, 'monthly']
        ]
    },
    "food_items": {
        "column": ["item_id", 'item_name', 'category_id'],
        "data": [
            [1, "tomato", 1],
            [2, "cucumber", 1],
            [3, "apple", 2],
            [4, "pear", 2],
            [5, "Beef", 3],
            [6, "Turkey meat", 3],
            [7, "chicken", 3],
            [8, "Salmon fish", 3],
            [9, "Milk", 4]
        ]
    },
    "business": {
        "column": ["business_id", "admin", "business_name"],
        "data": [
            [1, 2, "hotel one"],
            [2, 4, "cool restaurant"]
        ]
    },
    "department": {
        "column": ["department_id", "business_id", "department_name", "manager_id"],
        "data": [
            [1, 1, "restaurant", 2],
            [2, 1, "room service", 3],
            [3, 2, "main hall", 4]

        ]
    },

    "orders": {
        "column": ["order_id", "order_date", "order_creator_id", "business_id", "supplier_id", "price"],
        "data": [
            [1, '2014-10-19 10:23:54', 1, 2, 5, None],
            [2, '2014-10-19 10:24:00', 1, 2, 6, 25.5],
            [3, '2014-10-21 10:25:34', 1, 2, 5, None]
        ]
    },
    "order_content": {
        "column": ["order_id", "item_id", "price_per_unit", "amount", "unit"],
        "data": [
            [1, 1, 4.2, 30, "kg"],
            [1, 2, 4.3, 25, "kg"],
            [2, 3, 4, 12, "kg"],
            [2, 4, 5, 15, "kg"],
            [3, 1, 4.2, 17, "kg"],
            [3, 2, 4.3, 18, "kg"],
        ]
    },
    "recipes": {
        "column": ["recipe_id", "business_id", "recipe_name"],
        "data": [
            [1, 1, "regular salad"],
            [2, 1, "apple pear compote"],
            [3, 2, "regular salad"],
            [4, 2, "fried chicken"],
        ]
    },
    "notifications": {
        "column": ["code", "message", "business_id", "food_item_id", "active", "closed_by_user", "notification_level"],
        "data": [
            [1, None, 1, 2, True, None, 1],
            [3, None, 1, 2, True, None, 1],
            [2, None, 1, 1, True, None, 1],
            [3, None, 2, 2, True, None, 1],

            [3, None, 1, 9, True, None, 1],
            [2, None, 1, 6, True, None, 1],
            [1, None, 1, 7, True, None, 1],

        ]
    },
    "categories": {
        "column": ["category_id", "category_name"],
        "data": [
            [1, "Vegetables"],
            [2, "Fruit"],
            [3, "Meat & Fish"],
            [4, "Dairy"],
            [5, "Dry foods"],
            [6, "Other"]
        ]
    },
    "indexes": {
        "column": ["index_name", "index_val"],
        "data": [
            ["category_id", 7],
            ["business_id", 3],
            ["recipe_id", 5],
            ["item_id", 10],
            ["container_id", 7],
            ["user_id", 8],
            ["department_id", 5],
            ["rule_id", 5],

        ]
    },
    "rules": {
        "column": ["rule_id", "business_id", "item_id", "content_minimum_per_day", "content_maximum_per_day",
                   "content_total_minimum", "content_total_maximum", "active"],
        "data": [
            [1, 1, 2, 3, 10, 10, 50, True],
            [2, 1, 1, 3, 10, 10, 50, True],
            [3, 2, 1, 3, 11, 9, 51, True],
            [4, 2, 2, 3, 11, 9, 51, True]

        ]
    },

    "recipe_content": {
        "column": ["recipe_id", "item_id", "amount", "unit"],
        "data": [
            [1, 1, 0.5, "kg"],
            [1, 2, 0.5, "kg"],
            [2, 3, 0.6, "kg"],
            [2, 4, 0.4, "kg"],
            [3, 1, 0.4, "kg"],
            [3, 2, 0.4, "kg"],
            [4, 1, 1, "kg"],
        ]
    },
    "containers": {
        "column": ["container_id", "business_id", "item_id", "using_start_date", "default_order_value"],
        "data": [
            [1, 1, 1, '2014-10-19 18:23:54', 30],
            [2, 1, 2, '2014-10-19 18:49:25', 25],
            [3, 1, 3, '2014-10-19 19:22:54', 12],
            [4, 1, 4, '2014-10-19 19:39:54', 15],
            [7, 1, 5, '2014-10-19 19:39:54', 15],
            [8, 1, 6, '2014-10-19 19:39:54', 15],
            [9, 1, 7, '2014-10-19 19:39:54', 15],
            [10, 1, 8, '2014-10-19 19:39:54', 15],
            [11, 1, 9, '2014-10-19 19:39:54', 15],


            [5, 2, 1, '2014-10-19 15:29:54', 17],
            [6, 2, 2, '2014-10-19 15:34:54', 18],

        ]
    },
    "weights": {
        "column": ["container_id", "weighing_date", "weight_value", "last_user"],
        "data": [
            [1, '2014-10-19 18:24:54', 30, None],
            [1, '2014-10-19 19:15:54', 27, None],
            [1, '2014-10-20 07:00:03', 24, None],

            [2, '2014-10-19 18:50:25', 25, None],
            [2, '2014-10-20 07:15:17', 20, None],
            [2, '2014-10-20 12:01:12', 13, None],
            [2, '2014-10-20 18:52:50', 4, None],
            [2, '2014-10-21 07:00:42', 1, None],

            [3, '2014-10-19 19:23:54', 12, None],
            [3, '2014-10-20 08:23:00', 8, None],

            [4, '2014-10-19 19:40:54', 15, None],
            [4, '2014-10-20 08:25:27', 12, None],
            [4, '2014-10-20 19:15:50', 7.3, None],

            [5, '2014-10-19 15:30:54', 17, None],
            [5, '2014-10-19 17:20:02', 14, None],
            [5, '2014-10-19 20:17:47', 12, None],
            [5, '2014-10-20 08:37:21', 6.5, None],
            [5, '2014-10-20 12:42:02', 3, None],

            [6, '2014-10-19 15:35:54', 18, None],

            [7,  '2014-10-19 19:39:54', 0, None],
            [8, '2014-10-19 19:39:54', 0, None],
            [9, '2014-10-19 19:39:54', 0, None],
            [10,  '2014-10-19 19:39:54', 0, None],
            [11,  '2014-10-19 19:39:54', 0, None],

        ]
    },

}
table_list = [
    "indexes",
    "categories",
    "users",
    "user_preference",
    "business",
    "food_items",
    "supplier",
    "department",
    "notifications",
    "orders",
    "order_content",
    "recipes",
    "recipe_content",
    "containers",
    "weights",
    "rules"
]

# add users
# INSERT INTO  users(user_id, first_name, last_name,email_user_name,email_domain_name, address,phone_number,business_id,department_id )
# VALUES (10, 'fish', 'seller', 'fish', 'gmail.com', 'fishs place, JLM', '0522465661', null, null),
#             (8, 'milk', 'seller', 'milk', 'gmail.com', 'milks place, JLM', '0522434551', null, null),
#             (9, 'pasta', 'seller', 'pasta', 'gmail.com', 'pasta place, JLM', '0542147576', null, null);
# select * from users;