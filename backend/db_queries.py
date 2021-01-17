

def drop_table_query(table_name):
    return 200, "DROP TABLE " + table_name + " CASCADE;"


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
                if not val:
                    query += "null, "
                else:
                    query += str(val) + ", "
        query = query[:-2] + "),\n("
    query = query[:-3] + ";"
    if entered_loop:
        return 200, query
    else:
        return 400, "Bad request"


def break_select_parameters(tables, columns_per_table, conditions):
    """creates a select sql query
        expected input: tables =[table1,table2...]
                        columns = [[table 1 column names[column name, column nick, min/max functions]...]...]
                        conditions [[string containing the condition and/not/or, var1, condition, var2]...]
        expected output: sql query if all parameters legal None if not"""
    if columns_per_table:
        columns_len = len(columns_per_table)
    else:
        columns_len = 0
    select = []
    from_q = []
    where = ""
    group_by = []
    having = []

    aggregation_info = None
    if not columns_per_table or columns_len != len(tables):
        select.append(["*"])
    else:
        for i in range(columns_len):  # find first aggregation if exists
            columns_per_table[i].sort(key=len)
            if columns_per_table[i]:
                for col in columns_per_table[i]:
                    if col:
                        is_aggregation = len(col) == 3
                        addition = str(tables[i]) + "." + col[0]
                        if is_aggregation:
                            aggregation_info = True
                            addition = str(col[2]) + "(" + addition + ")"
                        try:
                            select.append([addition, col[1]])
                            group_by_addition = str(col[1])
                        except IndexError:
                            select.append([addition])
                            group_by_addition = addition
                        if not is_aggregation:
                            group_by.append(group_by_addition)

    for table in tables:
        if type(table) == list:
            from_q.append(table)
        else:
            from_q.append([table])

    if conditions:
        for i in range(len(conditions)):
            condition = conditions[i]
            if len(condition) == 4:
                if i == 0:
                    first = condition.pop(0).lower()
                    not_arr = ["not", "or not", "and not"]
                    if first in not_arr:
                        condition.insert(0, " NOT ")
            for cond in condition:
                where += " " + str(cond)+" "
    if not aggregation_info:
        group_by = None
    return select, from_q, where, group_by


def parse_params_with_nick(lis):
    """receives a list that contains a list of lists and returns an SQL string that represents them
        input:[[sql key 1],[sql key 2, nick],[sql key 3]......]
        output: sql key 1, sql key 2 AS nick, sql key 3...... """
    res = ""
    for arr in lis:
        try:
            res += str(arr[0]) + " AS " + str(arr[1])
        except IndexError:
            res += str(arr[0])
        finally:
            res += ", "
    return res[:-2]


def select_query(tables, columns_per_table, conditions):
    """creates a select sql query
           expected input: tables =[table1,table2...]
                           columns = [[table 1 column names[column name, column nick, min/max functions]...]...]
                           conditions [[string containing the condition and/not/or, var1, condition, var2]...]
           expected output: sql query if all parameters legal None if not"""
    select, from_q, where, group_by = break_select_parameters(tables, columns_per_table, conditions)
    query = "SELECT "
    txt = parse_params_with_nick(select)
    query += txt + "\nFROM "
    txt = parse_params_with_nick(from_q)
    query += txt
    if where:
        query += "\nWHERE " + where
    if group_by:
        query += " GROUP BY "
        for group in group_by:
            query += group + ", "
        query = query[:-2]
    return 200, query + ';'


def drop_table_query(table_name):
    return 200, "DROP TABLE " + table_name + " CASCADE;"


def add_table_code():
    return 200, """







   
CREATE TABLE "users" (
    "user_id" int   NOT NULL,
    "first_name" varchar(20)   NULL,
    "last_name" varchar(20)   NULL,
    "email_user_name" varchar(30)   NOT NULL,
    "email_domain_name" varchar(30)   NOT NULL,
    "address" varchar(40)   NULL,
    "phone_number" varchar(20)   NULL,
    "business_id" int   NOT NULL,
    "department_id" int   NULL,
    CONSTRAINT "pk_users" PRIMARY KEY (
        "user_id"
     )
);

CREATE TABLE "user_preference" (
    "user_id" int   NOT NULL,
    "lang" varchar(2)   NOT NULL
);

-- list of businesses
CREATE TABLE "business" (
    "business_id" int   NOT NULL,
    "admin" int  NULL,
    "business_name" varchar(100)   NOT NULL,
    CONSTRAINT "pk_business" PRIMARY KEY (
        "business_id"
     )
);

-- contains a name for each item
CREATE TABLE "food_items" (
    "item_id" int   NOT NULL,
    "item_name" varchar(40)   NOT NULL,
    "category_id" int   NOT NULL,
    CONSTRAINT "pk_food_items" PRIMARY KEY (
        "item_id"
     )
);

-- a list of suppliers and one item they provide in each row
CREATE TABLE "supplier" (
    "supplier_id" int   NOT NULL,
    "business_id" int   NOT NULL,
    "item_id" int   NOT NULL,
    "days_to_provide" varchar(7)   NOT NULL,
    "frequency" varchar(10)   NOT NULL,
    "preferred_contact" varchar(10)  NULL
);

-- list the departments in a business
CREATE TABLE "department" (
    "department_id" int   NOT NULL,
    "business_id" int   NOT NULL,
    "department_name" varchar(50)   NOT NULL,
    "manager_id" int   NOT NULL,
    CONSTRAINT "pk_department" PRIMARY KEY (
        "department_id"
     )
);

-- contains recipes for businesses in each row
CREATE TABLE "recipes" (
    "recipe_id" int   NOT NULL,
    "business_id" int   NOT NULL,
    "recipe_name" varchar(100)   NOT NULL,
    CONSTRAINT "pk_recipes" PRIMARY KEY (
        "recipe_id"
     )
);

-- notificatoin information
CREATE TABLE "notifications" (
    "code" int   NOT NULL,
    "message" varchar(255)   NULL,
    "business_id" int   NOT NULL,
    "food_item_id" int   NOT NULL,
    "active" boolean   NOT NULL,
    "closed_by_user" int   NULL,
    "notification_level" int   NOT NULL
);

-- contains a list of orders in every row
CREATE TABLE "orders" (
    "order_id" int   NOT NULL,
    "order_date" timestamp   NOT NULL,
    "order_creator_id" int   NOT NULL,
    "business_id" int   NOT NULL,
    "supplier_id" int   NOT NULL,
    "price" real   NULL,
    CONSTRAINT "pk_orders" PRIMARY KEY (
        "order_id"
     )
);

-- contains an item orderd in every row
CREATE TABLE "order_content" (
    "item_id" int   NOT NULL,
    "order_id" int   NOT NULL,
    "price_per_unit" real   NULL,
    "amount" int   NULL,
    "unit" varchar(2)   NOT NULL
);

-- contains of recipes in each row
CREATE TABLE "recipe_content" (
    "recipe_id" int   NOT NULL,
    "item_id" int   NOT NULL,
    "amount" int   NOT NULL,
    "unit" varchar(2)   NOT NULL
);

-- has a cntainer and its contence id in every row
CREATE TABLE "containers" (
    "container_id" int   NOT NULL,
    "business_id" int   NOT NULL,
    "item_id" int   NOT NULL,
    "using_start_date" timestamp   NOT NULL,
    "default_order_value" real   NOT NULL,
    CONSTRAINT "pk_containers" PRIMARY KEY (
        "container_id"
     )
);

-- contains a weight that was taken in every row
CREATE TABLE "weights" (
    "weighing_date" timestamp   NOT NULL,
    "container_id" int   NOT NULL,
    "weight_value" int   NOT NULL,
    "last_user" int   NULL,
    CONSTRAINT "pk_weights" PRIMARY KEY (
        "weighing_date"
     )
);

CREATE TABLE "categories" (
    "category_id" int   NOT NULL,
    "category_name" varchar(100)   NOT NULL,
    CONSTRAINT "pk_categories" PRIMARY KEY (
        "category_id"
     )
);

CREATE TABLE "rules" (
    "rule_id" int   NOT NULL,
    "business_id" int   NOT NULL,
    "item_id" int   NOT NULL,
    "content_minimum_per_day" real   NOT NULL,
    "content_maximum_per_day" real   NOT NULL,
    "content_total_minimum" real   NOT NULL,
    "content_total_maximum" real   NOT NULL,
    "active" boolean   NOT NULL,
    CONSTRAINT "pk_rules" PRIMARY KEY (
        "rule_id"
     )
);

-- server indexes maximum index for client
CREATE TABLE "indexes" (
    "index_name" varchar(20)   NOT NULL,
    "index_val" int   NOT NULL
);

ALTER TABLE "users" ADD CONSTRAINT "fk_users_business_id" FOREIGN KEY("business_id")
REFERENCES "business" ("business_id");

ALTER TABLE "user_preference" ADD CONSTRAINT "fk_user_preference_user_id" FOREIGN KEY("user_id")
REFERENCES "users" ("user_id");

ALTER TABLE "business" ADD CONSTRAINT "fk_business_admin" FOREIGN KEY("admin")
REFERENCES "users" ("user_id");

ALTER TABLE "food_items" ADD CONSTRAINT "fk_food_items_category_id" FOREIGN KEY("category_id")
REFERENCES "categories" ("category_id");

ALTER TABLE "supplier" ADD CONSTRAINT "fk_supplier_supplier_id" FOREIGN KEY("supplier_id")
REFERENCES "users" ("user_id");

ALTER TABLE "supplier" ADD CONSTRAINT "fk_supplier_business_id" FOREIGN KEY("business_id")
REFERENCES "business" ("business_id");

ALTER TABLE "department" ADD CONSTRAINT "fk_department_manager_id" FOREIGN KEY("manager_id")
REFERENCES "users" ("user_id");

ALTER TABLE "recipes" ADD CONSTRAINT "fk_recipes_business_id" FOREIGN KEY("business_id")
REFERENCES "business" ("business_id");

ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_business_id" FOREIGN KEY("business_id")
REFERENCES "business" ("business_id");

ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_food_item_id" FOREIGN KEY("food_item_id")
REFERENCES "food_items" ("item_id");

ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_closed_by_user" FOREIGN KEY("closed_by_user")
REFERENCES "users" ("user_id");

ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_order_creator_id" FOREIGN KEY("order_creator_id")
REFERENCES "users" ("user_id");

ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_business_id" FOREIGN KEY("business_id")
REFERENCES "business" ("business_id");

ALTER TABLE "order_content" ADD CONSTRAINT "fk_order_content_item_id" FOREIGN KEY("item_id")
REFERENCES "food_items" ("item_id");

ALTER TABLE "order_content" ADD CONSTRAINT "fk_order_content_order_id" FOREIGN KEY("order_id")
REFERENCES "orders" ("order_id");

ALTER TABLE "recipe_content" ADD CONSTRAINT "fk_recipe_content_recipe_id" FOREIGN KEY("recipe_id")
REFERENCES "recipes" ("recipe_id");

ALTER TABLE "recipe_content" ADD CONSTRAINT "fk_recipe_content_item_id" FOREIGN KEY("item_id")
REFERENCES "food_items" ("item_id");

ALTER TABLE "containers" ADD CONSTRAINT "fk_containers_business_id" FOREIGN KEY("business_id")
REFERENCES "business" ("business_id");

ALTER TABLE "containers" ADD CONSTRAINT "fk_containers_item_id" FOREIGN KEY("item_id")
REFERENCES "food_items" ("item_id");

ALTER TABLE "weights" ADD CONSTRAINT "fk_weights_container_id" FOREIGN KEY("container_id")
REFERENCES "containers" ("container_id");

ALTER TABLE "weights" ADD CONSTRAINT "fk_weights_last_user" FOREIGN KEY("last_user")
REFERENCES "users" ("user_id");

ALTER TABLE "rules" ADD CONSTRAINT "fk_rules_business_id" FOREIGN KEY("business_id")
REFERENCES "business" ("business_id");

ALTER TABLE "rules" ADD CONSTRAINT "fk_rules_item_id" FOREIGN KEY("item_id")
REFERENCES "food_items" ("item_id");


ALTER TABLE "order_content" ADD CONSTRAINT "fk_order_content_order_id" FOREIGN KEY("order_id")
REFERENCES "orders" ("order_id");

"""