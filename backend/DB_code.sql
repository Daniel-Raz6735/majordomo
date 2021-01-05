-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/BU9Kc5
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


-- a list of all users in the system
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
    "item_id" int   NOT NULL,
    "days_to_provide" varchar(7)   NOT NULL,
    "preferd_contact" varchar(10)   NOT NULL,
    CONSTRAINT "pk_supplier" PRIMARY KEY (
        "supplier_id"
     )
);

-- list of businesses
CREATE TABLE "client" (
    "client_id" int   NOT NULL,
    "admin" int   NOT NULL,
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

-- contains recipes for businesses in each row
CREATE TABLE "recipes" (
    "recipe_id" int   NOT NULL,
    "client_id" int   NOT NULL,
    CONSTRAINT "pk_recipes" PRIMARY KEY (
        "recipe_id"
     )
);

-- contains of recipes in each row
CREATE TABLE "recipe_content" (
    "recipe_id" int   NOT NULL,
    "item_id" int   NOT NULL,
    "amount" int   NOT NULL
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
    "client_id" int   NOT NULL,
    "order_creator_id" int   NOT NULL,
    "supplier_id" int   NOT NULL,
    "price" real   NULL,
    CONSTRAINT "pk_orders" PRIMARY KEY (
        "order_id"
     )
);

-- contains an item orderd in every row
CREATE TABLE "order_content" (
    "order_date" timestamp   NOT NULL,
    "item_id" int   NOT NULL,
    "order_id" int   NOT NULL,
    "amount" int   NOT NULL,
    "unit" varchar(2)   NOT NULL,
    "price" real   NULL,
    "price_per_unit" real   NULL,
    CONSTRAINT "pk_order_content" PRIMARY KEY (
        "order_date"
     )
);

-- has a cntainer and its contence id in every row
CREATE TABLE "containers" (
    "container_id" int   NOT NULL,
    "client_id" int   NOT NULL,
    "item_id" int   NOT NULL,
    "using_start_date" timestamp   NOT NULL,
    CONSTRAINT "pk_containers" PRIMARY KEY (
        "container_id"
     )
);

-- Free plan table limit reached. SUBSCRIBE for more.

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

-- Free plan table limit reached. SUBSCRIBE for more.



ALTER TABLE "supplier" ADD CONSTRAINT "fk_supplier_item_id" FOREIGN KEY("item_id")
REFERENCES "food_items" ("item_id");

ALTER TABLE "client" ADD CONSTRAINT "fk_client_admin" FOREIGN KEY("admin")
REFERENCES "users" ("user_id");

ALTER TABLE "department" ADD CONSTRAINT "fk_department_client_id" FOREIGN KEY("client_id")
REFERENCES "client" ("client_id");

ALTER TABLE "recipes" ADD CONSTRAINT "fk_recipes_client_id" FOREIGN KEY("client_id")
REFERENCES "client" ("client_id");

ALTER TABLE "recipe_content" ADD CONSTRAINT "fk_recipe_content_recipe_id" FOREIGN KEY("recipe_id")
REFERENCES "recipes" ("recipe_id");

ALTER TABLE "recipe_content" ADD CONSTRAINT "fk_recipe_content_item_id" FOREIGN KEY("item_id")
REFERENCES "food_items" ("item_id");

ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_client_id" FOREIGN KEY("client_id")
REFERENCES "client" ("client_id");

ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_order_creator_id" FOREIGN KEY("order_creator_id")
REFERENCES "users" ("user_id");

ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_supplier_id" FOREIGN KEY("supplier_id")
REFERENCES "supplier" ("supplier_id");

ALTER TABLE "order_content" ADD CONSTRAINT "fk_order_content_item_id" FOREIGN KEY("item_id")
REFERENCES "food_items" ("item_id");

ALTER TABLE "order_content" ADD CONSTRAINT "fk_order_content_order_id" FOREIGN KEY("order_id")
REFERENCES "orders" ("order_id");

ALTER TABLE "containers" ADD CONSTRAINT "fk_containers_client_id" FOREIGN KEY("client_id")
REFERENCES "client" ("client_id");

ALTER TABLE "containers" ADD CONSTRAINT "fk_containers_item_id" FOREIGN KEY("item_id")
REFERENCES "food_items" ("item_id");


ALTER TABLE "weights" ADD CONSTRAINT "fk_weights_container_id" FOREIGN KEY("container_id")
REFERENCES "containers" ("container_id");
-- Free plan table limit reached. SUBSCRIBE for more.



-- Free plan table limit reached. SUBSCRIBE for more.



