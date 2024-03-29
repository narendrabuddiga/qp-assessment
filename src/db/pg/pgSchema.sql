--SELECT * FROM INFORMATION_SCHEMA. TABLES  
--WHERE table_type='BASE TABLE' and table_schema='supply_management'
CREATE SCHEMA IF NOT EXISTS supply_management;

CREATE TABLE IF NOT EXISTS supply_management.users(
     USER_ID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     USERNAME VARCHAR(255) UNIQUE NOT NULL ,
     FIRSTNAME VARCHAR(255) NOT NULL,
     LASTNAME VARCHAR(255) NOT NULL,
     GENDER VARCHAR(25) NOT NULL,
     EMAIL VARCHAR(255) UNIQUE NOT NULL,
     IS_DELETED BOOLEAN NOT NULL DEFAULT FALSE,
     CREATED_ON TIMESTAMP NOT NULL DEFAULT NOW(), 
     UPDATED_ON TIMESTAMP,
     CREATED_BY VARCHAR(255),
     UPDATED_BY VARCHAR(255),
     LAST_LOGIN TIMESTAMP
);

CREATE TABLE IF NOT EXISTS supply_management.user_secrets(
     USER_SECRET_ID SERIAL PRIMARY KEY,
     USER_ID UUID NOT NULL,
     PASSKEY VARCHAR(255) NOT NULL,
     CREATED_ON TIMESTAMP NOT NULL DEFAULT NOW(),
     CREATED_BY VARCHAR(255),
     UPDATED_BY VARCHAR(255),
     UPDATED_ON TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS supply_management.user_address(
     USER_ADDRESS_ID SERIAL PRIMARY KEY,
     USER_ID UUID NOT NULL,
     LOCATION VARCHAR(255) NOT NULL,
     IS_DELETED BOOLEAN NOT NULL DEFAULT FALSE,
     CREATED_ON TIMESTAMP NOT NULL DEFAULT NOW(),
     CREATED_BY VARCHAR(255),
     UPDATED_BY VARCHAR(255),
     UPDATED_ON TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS supply_management.user_roles(
     USER_ID UUID NOT NULL,
     ROLE_TYPE VARCHAR(255) NOT NULL,
     CREATED_ON TIMESTAMP NOT NULL DEFAULT NOW(),
     UPDATED_ON TIMESTAMP,
     CREATED_BY VARCHAR(255),
     UPDATED_BY VARCHAR(255),
     PRIMARY KEY (USER_ID)
);

CREATE TABLE IF NOT EXISTS supply_management.inventories(
     INVENTORY_ID SERIAL PRIMARY KEY,
     NAME VARCHAR(255) NOT NULL,
     LOCATION VARCHAR(255) NOT NULL,
     IS_DELETED BOOLEAN NOT NULL DEFAULT FALSE,
     CREATED_ON TIMESTAMP NOT NULL DEFAULT NOW(),
     CREATED_BY VARCHAR(255) NOT NULL,
     UPDATED_BY VARCHAR(255),
     UPDATED_ON TIMESTAMP
);

CREATE TABLE IF NOT EXISTS supply_management.inventory_mapping(
     INVENTORY_ID INT NOT NULL,
     PRODUCT_ID INT NOT NULL,
     AVAILABLE_QUANTITY INT NOT NULL,
     IS_AVAILABLE BOOLEAN NOT NULL,
     CREATED_ON TIMESTAMP NOT NULL DEFAULT NOW(),
     UPDATED_ON TIMESTAMP,
     CREATED_BY VARCHAR(255) NOT NULL,
     UPDATED_BY VARCHAR(255),
     PRIMARY KEY (INVENTORY_ID, PRODUCT_ID)
);


CREATE TABLE IF NOT EXISTS supply_management.products (
  PRODUCT_ID SERIAL PRIMARY KEY, 
  NAME VARCHAR(255) NOT NULL,
  DESCRIPTION TEXT, 
  TYPE VARCHAR(255) NOT NULL,
  UNIT_NAME VARCHAR(255) NOT NULL,
  UNIT_VALUE VARCHAR(255) NOT NULL,
  UNIT_PRICE DEC(10, 2) NOT NULL,
  CURRENCY VARCHAR(255) NOT NULL,
  IS_DELETED BOOLEAN NOT NULL DEFAULT FALSE,
  CREATED_ON TIMESTAMP NOT NULL DEFAULT NOW(),
  CREATED_BY VARCHAR(255) NOT NULL,
  UPDATED_BY VARCHAR(255),
  UPDATED_ON TIMESTAMP,
  UNIQUE (NAME,TYPE)
);

CREATE TABLE IF NOT EXISTS supply_management.orders(
     ORDER_ID SERIAL PRIMARY KEY,
     USER_ID UUID NOT NULL,
     TOTAL_ORDER_PRICE VARCHAR(255) NOT NULL,
     IS_DELETED BOOLEAN NOT NULL DEFAULT FALSE,
     CREATED_ON TIMESTAMP NOT NULL DEFAULT NOW(),
     CREATED_BY VARCHAR(255) NOT NULL,
     UPDATED_BY VARCHAR(255),
     UPDATED_ON TIMESTAMP
);

CREATE TABLE IF NOT EXISTS supply_management.order_details(
  ORDER_ID INT NOT NULL, 
  PRODUCT_ID INT NOT NULL, 
  PRODUCT_QUANTITY INTEGER NOT NULL, 
  TOTAL_PRICE DEC(10, 2) NOT NULL,
  CREATED_ON TIMESTAMP NOT NULL DEFAULT NOW(),
  UPDATED_ON TIMESTAMP,
  CREATED_BY VARCHAR(255) NOT NULL,
  UPDATED_BY VARCHAR(255),
  PRIMARY KEY (ORDER_ID, PRODUCT_ID)
);