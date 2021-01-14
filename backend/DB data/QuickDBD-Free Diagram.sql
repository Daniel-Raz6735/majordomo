-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/BU9Kc5
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


-- a list of all users in the system
CREATE TABLE "users" (
    "user_id" int   NOT NULL,
    "first_name" varchar(20)   NULL,
    "last_name" varchar(20)   NULL,
    "email_userName" varchar(30)   NOT NULL,
    "email_domainName" varchar(30)   NOT NULL,
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
    "admin" int   NOT NULL,
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
    "preferred_contact" varchar(10)   NOT NULL
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
    "closed_by_user" int   NOT NULL,
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

ALTER TABLE "supplier" ADD CONSTRAINT "fk_supplier_item_id" FOREIGN KEY("item_id")
REFERENCES "food_items" ("item_id");

ALTER TABLE "department" ADD CONSTRAINT "fk_department_business_id" FOREIGN KEY("business_id")
REFERENCES "business" ("business_id");

ALTER TABLE "department" ADD CONSTRAINT "fk_department_manager_id" FOREIGN KEY("manager_id")
REFERENCES "users" ("first_name");

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

ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_supplier_id" FOREIGN KEY("supplier_id")
REFERENCES "supplier" ("supplier_id");

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

