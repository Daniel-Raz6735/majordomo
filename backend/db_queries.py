

def drop_table_query(table_name, null_val1=None, null_val2=None):
    return 200, "DROP TABLE " + table_name + " CASCADE;"


def create_table_query(table_name, cols=None, null_val=None):
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


def break_select_parameters(tables, columns_per_table, conditions, group_by_cols=None, iteration=0):
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
    table_cols = []
    from_q = []
    where = ""
    group_by = []
    having = []

    aggregation_table = -1
    aggregation_info = None
    if not columns_per_table or columns_len != len(tables):
        select.append(["*"])
    else:
        for i in range(columns_len):  # find first aggregation if exists
            columns_per_table[i].sort(key=len)
            if columns_per_table[i] and columns_per_table[i][0] and len(columns_per_table[i][0]) == 3:
                aggregation_info = columns_per_table[i]
                aggregation_op = columns_per_table[i][0].pop(-1)  #pop out the aggregator found and receive a table without it
                aggregation_column =
                for j in range(len(columns_per_table)):

                    for column in columns_per_table[i]: # get column per tables
                        try:
                            if column[1]:
                                group_by.append(column[1])
                        except IndexError:
                            string_to_append = str(tables[j]) + "." + column[0]
                            if len(column) > 2:
                                group_by.append(column[2]+"("+string_to_append+")")
                            else:
                                group_by.append(string_to_append)


                q = select_query(tables, columns_per_table, conditions, group_by)
                print(q)
                tables = [[q, "t"+str(iteration)]]
                # columns_per_table[]

                print("\n", q[1], "\n")

                # addition = col[2] + "(" + addition + ")"

        for i in range(len(columns_per_table)):
            if columns_per_table[i]:
                for col in columns_per_table[i]:
                    addition = tables[i] + "." + col[0]
                    col_len = len(col)
                    try:
                        select.append([addition, col[1]])
                        group_by.append(col[1])
                    except IndexError:
                        select.append([addition])
                        group_by.append(addition)

    for table in tables:
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
                where += ", "
        where = where[:-2]
    return select, from_q, where, group_by


def parse_params_with_nick(lis):
    """receives a list that contains a list of lists and returns an SQL string that represents them
        input:[[sql key 1],[sql key 2, nick],[sql key 3]......]
        output: sql key 1, sql key 2 AS nick, sql key 3...... """
    res = ""
    for arr in lis:
        try:
            res += arr[0] + " AS " + arr[1]
        except IndexError:
            res += arr[0]
        finally:
            res += ", "
    return res[:-2]


def select_query(tables, columns_per_table, conditions, group_by_cols=None):
    """creates a select sql query
           expected input: tables =[table1,table2...]
                           columns = [[table 1 column names[column name, column nick, min/max functions]...]...]
                           conditions [[string containing the condition and/not/or, var1, condition, var2]...]
           expected output: sql query if all parameters legal None if not"""
    select, from_q, where, group_by = break_select_parameters(tables, columns_per_table, conditions, group_by_cols)
    query = "SELECT "
    txt = parse_params_with_nick(select)
    query += txt + "\nFROM "
    txt = parse_params_with_nick(from_q)
    query += txt
    if where:
        query += "\nWHERE " + where
    if group_by_cols:
        query += " GROUP BY "
        for group in group_by_cols:
            query += group + ", "
        query = query[:-2]
    return 200, query + ';'


def drop_table_query(table_name, null_val1, null_val2):
    return 200, "DROP TABLE " + table_name + " CASCADE;"


def add_table_code(null, null_val1, null_val2):
    return 200, """
    CREATE TABLE "users" (
    "user_id" int   NOT NULL,
    "first_name" varchar(20)   NULL,
    "last_name" varchar(20)   NULL,
    "email" varchar(40)   NULL,
    "address" varchar(40)   NULL,
    "phone_number" varchar(20)   NULL,
    "department_id" int   NULL,
    CONSTRAINT "pk_users" PRIMARY KEY (
        "user_id"
     )
);

-- a list of suppliers and one item they provide in each row
CREATE TABLE "supplier" (
    "supplier_id" int   NOT NULL,
    "client_id" int   NOT NULL,
    "item_id" int   NOT NULL,
    "days_to_provide" varchar(7)   NOT NULL,
    "preferred_contact" varchar(10)   NOT NULL
);

-- list of businesses
CREATE TABLE "client" (
    "client_id" int   NOT NULL,
    "admin" int   NOT NULL,
    "client_name" varchar   NOT NULL,
    CONSTRAINT "pk_client" PRIMARY KEY (
        "client_id"
     )
);

-- list the departments in a business
CREATE TABLE "department" (
    "department_id" int   NOT NULL,
    "client_id" int   NOT NULL,
    "department_name" varchar(15)   NOT NULL,
    CONSTRAINT "pk_department" PRIMARY KEY (
        "department_id"
     )
);

CREATE TABLE "worker" (
    "worker_id" int   NOT NULL,
    "department_id" int   NOT NULL
);

-- contains recipes for businesses in each row
CREATE TABLE "recipes" (
    "recipe_id" int   NOT NULL,
    "client_id" int   NOT NULL,
    "recipe_name" varchar(30)   NOT NULL,
    CONSTRAINT "pk_recipes" PRIMARY KEY (
        "recipe_id"
     )
);

-- contains a name for each item
CREATE TABLE "food_items" (
    "item_id" int   NOT NULL,
    "item_name" varchar(20)   NOT NULL,
    CONSTRAINT "pk_food_items" PRIMARY KEY (
        "item_id"
     )
);

-- contains a list of orders in every row
CREATE TABLE "orders" (
    "order_id" int   NOT NULL,
    "order_date" timestamp   NOT NULL,
    "order_creator_id" int   NOT NULL,
    "client_id" int   NOT NULL,
    "supplier_id" int   NOT NULL,
    "price" real   NULL,
    CONSTRAINT "pk_orders" PRIMARY KEY (
        "order_id","order_date"
     )
);

-- contains an item orderd in every row
CREATE TABLE "order_content" (
    "order_id" int   NOT NULL,
    "item_id" int   NOT NULL,
    "price_per_unit" real   NULL,
    "amount" int   NOT NULL,
    "unit" varchar(2)   NOT NULL
);

-- contains of recipes in each row
CREATE TABLE "recipe_content" (
    "recipe_id" int   NOT NULL,
    "item_id" int   NOT NULL,
    "amount" int   NOT NULL,
    "unit" varchar(2)   NOT NULL
);

CREATE TABLE "containers" (
    "container_id" int   NOT NULL,
    "client_id" int   NOT NULL,
    "item_id" int   NOT NULL,
    "using_start_date" timestamp   NOT NULL,
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

ALTER TABLE "supplier" ADD CONSTRAINT "fk_supplier_supplier_id" FOREIGN KEY("supplier_id")
REFERENCES "users" ("user_id");

ALTER TABLE "supplier" ADD CONSTRAINT "fk_supplier_client_id" FOREIGN KEY("client_id")
REFERENCES "client" ("client_id");

ALTER TABLE "supplier" ADD CONSTRAINT "fk_supplier_item_id" FOREIGN KEY("item_id")
REFERENCES "food_items" ("item_id");

ALTER TABLE "client" ADD CONSTRAINT "fk_client_admin" FOREIGN KEY("admin")
REFERENCES "users" ("user_id");

ALTER TABLE "department" ADD CONSTRAINT "fk_department_client_id" FOREIGN KEY("client_id")
REFERENCES "client" ("client_id");

ALTER TABLE "worker" ADD CONSTRAINT "fk_worker_worker_id" FOREIGN KEY("worker_id")
REFERENCES "users" ("user_id");

ALTER TABLE "worker" ADD CONSTRAINT "fk_worker_department_id" FOREIGN KEY("department_id")
REFERENCES "department" ("department_id");

ALTER TABLE "recipes" ADD CONSTRAINT "fk_recipes_client_id" FOREIGN KEY("client_id")
REFERENCES "client" ("client_id");

ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_order_creator_id" FOREIGN KEY("order_creator_id")
REFERENCES "users" ("user_id");

ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_client_id" FOREIGN KEY("client_id")
REFERENCES "client" ("client_id");





ALTER TABLE "order_content" ADD CONSTRAINT "fk_order_content_item_id" FOREIGN KEY("item_id")
REFERENCES "food_items" ("item_id");

ALTER TABLE "recipe_content" ADD CONSTRAINT "fk_recipe_content_recipe_id" FOREIGN KEY("recipe_id")
REFERENCES "recipes" ("recipe_id");

ALTER TABLE "recipe_content" ADD CONSTRAINT "fk_recipe_content_item_id" FOREIGN KEY("item_id")
REFERENCES "food_items" ("item_id");

ALTER TABLE "containers" ADD CONSTRAINT "fk_containers_client_id" FOREIGN KEY("client_id")
REFERENCES "client" ("client_id");

ALTER TABLE "containers" ADD CONSTRAINT "fk_containers_item_id" FOREIGN KEY("item_id")
REFERENCES "food_items" ("item_id");

ALTER TABLE "weights" ADD CONSTRAINT "fk_weights_container_id" FOREIGN KEY("container_id")
REFERENCES "containers" ("container_id");
    
    """
#
# ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_supplier_id" FOREIGN KEY("supplier_id")
# REFERENCES "supplier" ("supplier_id");

# ALTER TABLE "order_content" ADD CONSTRAINT "fk_order_content_order_id" FOREIGN KEY("order_id")
# REFERENCES "orders" ("order_id");
