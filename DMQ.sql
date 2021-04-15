-- *** groups entity queries
-- selects all data from groups table
SELECT * FROM groups

-- inserts new group into groups table
INSERT INTO groups (`group_name`, `group_discount`) VALUES (?, ?);

-- drops current groups table and creates a new one
DROP TABLE IF EXISTS groups;
CREATE TABLE groups(
                            group_id INT(11) NOT NULL AUTO_INCREMENT,
                            group_name VARCHAR(225) NOT NULL,
                            group_discount DECIMAL NOT NULL,
                            PRIMARY KEY (group_id)
                            );

-- updates a current group item in groups table, based on group_id
UPDATE groups SET group_name=?, group_discount =? WHERE group_id=?;

-- deletes a current group item in groups table, based on group_id
DELETE FROM groups WHERE group_id=?;


-- ** customers entity queries
-- selects all data from customers table
SELECT * FROM customers;

-- inserts new customer into customers table
INSERT INTO customers (`first_name`, `last_name`, `email`, `group_id`) VALUES (?, ?, ?, ?);

-- drops current customer table and creates a new one
DROP TABLE IF EXISTS customers;
CREATE TABLE customers(
                        customer_id INT(11) NOT NULL AUTO_INCREMENT,
                        first_name VARCHAR(225) NOT NULL,
                        last_name VARCHAR(225) NOT NULL,
                        email VARCHAR(225) NOT NULL,
                        group_id INT(11) NULL,
                        PRIMARY KEY (customer_id),
                        FOREIGN KEY (group_id)
                        REFERENCES groups(group_id)
                        );

-- deletes a current customer item in alpacas table, based on customer_id
DELETE FROM customers WHERE customer_id=?;


-- *** alpacas entity queries
-- selects all data from alpacas table
SELECT * FROM alpacas;

-- inserts new alpaca into alpacas table
INSERT INTO alpacas (`alpaca_name`, `age`, `breed`) VALUES (?, ?, ?);

-- drops current alpacas table and creates a new one
DROP TABLE IF EXISTS alpacas;
CREATE TABLE alpacas(
                        alpaca_id INT(11) NOT NULL AUTO_INCREMENT,
                        alpaca_name VARCHAR(225) NOT NULL,
                        age INT(11) NOT NULL,
                        breed VARCHAR(225) NOT NULL,
                        PRIMARY KEY (alpaca_id)
                        );

-- updates a current alpaca item in alpacas table, based on alpaca_id
UPDATE alpacas SET alpaca_name=?, age =?, breed =? WHERE alpaca_id=?;

-- deletes a current alpaca item in alpacas table, based on alpaca_id
DELETE FROM alpacas WHERE alpaca_id=?;


-- *** experiences entity queries
-- selects all data from experiences table
SELECT * FROM experiences;

-- inserts new experience into experiences table
INSERT INTO experiences (`experience_name`, `experience_price`) VALUES (?, ?);

-- drops current experiences table and creates a new one
DROP TABLE IF EXISTS experiences;
CREATE TABLE experiences(
                            experience_id INT(11) NOT NULL AUTO_INCREMENT,
                            experience_name VARCHAR(225) NOT NULL,
                            experience_price DECIMAL NOT NULL,
                            PRIMARY KEY (experience_id)
                            );

-- updates a current experience item in experiences table, based on experience_id
UPDATE experiences SET experience_name=?, experience_price =? WHERE experience_id=?;

-- deletes a current experience item in experiences table, based on experience_id
DELETE FROM experiences WHERE experience_id=?;


-- *** experiences_alpacas entity queries
-- selects all data from alpacas table
SELECT * FROM experiences_alpacas;

-- inserts new experiences_alpacas into experiences_alpacas table
INSERT INTO experiences_alpacas (`experience_id`, `alpaca_id`) VALUES (?, ?);

-- drops current experiences_alpacas table and creates a new one
DROP TABLE IF EXISTS experiences_alpacas;
CREATE TABLE experiences_alpacas(
                            ea_id INT(11) NOT NULL AUTO_INCREMENT,
                            experience_id INT(11) NOT NULL,
                            alpaca_id INT(11) NOT NULL,
                            PRIMARY KEY (ea_id),
                            FOREIGN KEY (alpaca_id)
                            REFERENCES alpacas(alpaca_id)
                            ON UPDATE CASCADE
                            ON DELETE CASCADE,
                            FOREIGN KEY (experience_id)
                            REFERENCES experiences(experience_id)
                            ON UPDATE CASCADE
                            ON DELETE CASCADE
                            );

-- selects joined data from experiences_alpacas, experiences, and alpacas tables
-- experiences.experience_name and alpacas.alpaca_name inner join data is utilized in the front-end to show the names for each experiences_alpacas instead of the FKs
SELECT ea_id, experiences_alpacas.experience_id, experiences_alpacas.alpaca_id, experiences.experience_name, alpacas.alpaca_name FROM experiences_alpacas
                            INNER JOIN experiences ON experiences_alpacas.experience_id = experiences.experience_id
                            INNER JOIN alpacas ON experiences_alpacas.alpaca_id = alpacas.alpaca_id
                            ORDER BY ea_id ASC;

-- updates a current experiences_alpacas item in experiences_alpacas table, based on ea_id
UPDATE experiences_alpacas SET experience_id =?, alpaca_id =? WHERE ea_id =?;

-- deletes a current experiences_alpacas item in experiences_alpacas table, based on ea_id
DELETE FROM experiences_alpacas WHERE ea_id =?;


-- *** orders entity queries
-- selects joined data from orders, customers, experiences_alpacas, experiences, and alpacas table
-- joined data is utilized to display front-end table with appropriate names/descriptions instead of FKs
SELECT order_id, CONCAT(customers.first_name, " ",customers.last_name) AS customer_name , CONCAT(experiences.experience_name, " ", alpacas.alpaca_name) AS ea_name, ticket_quantity, order_date, order_subtotal FROM orders
                            INNER JOIN customers ON orders.customer_id = customers.customer_id
                            INNER JOIN experiences_alpacas ON orders.ea_id = experiences_alpacas.ea_id
                            INNER JOIN experiences ON experiences_alpacas.experience_id = experiences.experience_id
                            INNER JOIN alpacas ON experiences_alpacas.alpaca_id = alpacas.alpaca_id
                            ORDER BY order_id ASC;

-- inserts new order into orders table
-- utilizes other queries to the experiences_alpacas, experiences, customers, groups entities (see below)
INSERT INTO orders (`customer_id`, `ea_id`, `ticket_quantity`, `order_date`, `order_subtotal`) VALUES (?, ?, ?, ?, ?);
-- additional queries that are utilized when creating front-end orders page
--- used for the dropdown menu in the insert orders form (data for current customers)
SELECT customer_id, CONCAT(first_name, " ", last_name) AS customer_name FROM customers ORDER BY customer_name ASC;
--- used for the dropdown menu in the insert orders form (data for current experiences_alpacas)
SELECT ea_id, CONCAT(experiences.experience_name, " ", alpacas.alpaca_name) AS ea_name FROM experiences_alpacas
                            INNER JOIN experiences ON experiences_alpacas.experience_id = experiences.experience_id
                            INNER JOIN alpacas ON experiences_alpacas.alpaca_id = alpacas.alpaca_id
                            ORDER BY ea_name ASC;
-- additional queries that are utilized in insert query code (which runs multiple queries)
--- used for calculating order's order_subtotal (by finding customer's group_id's group_discount; if customer doesn't have group_id (NULL), then returns 0)
SELECT (IFNULL(groups.group_discount,0)) AS group_discount FROM customers
                            LEFT JOIN groups ON customers.group_id = groups.group_id
                            WHERE customer_id =?;
--- used for calculating order's order_subtotal (by finding experiences_alpacas's experience_id's experience_price)
SELECT experiences.experience_price FROM experiences_alpacas
                            INNER JOIN experiences ON experiences_alpacas.experience_id = experiences.experience_id
                            WHERE ea_id =?;

-- drops current orders table and creates a new one
DROP TABLE IF EXISTS orders;
SELECT order_id, CONCAT(customers.first_name, " ",customers.last_name) AS customer_name , CONCAT(experiences.experience_name, " ", alpacas.alpaca_name) AS ea_name, ticket_quantity, order_date, order_subtotal FROM orders
                            INNER JOIN customers ON orders.customer_id = customers.customer_id
                            INNER JOIN experiences_alpacas ON orders.ea_id = experiences_alpacas.ea_id
                            INNER JOIN experiences ON experiences_alpacas.experience_id = experiences.experience_id
                            INNER JOIN alpacas ON experiences_alpacas.alpaca_id = alpacas.alpaca_id
                            ORDER BY order_id ASC;

-- deletes a current orders item in orders table, based on order_id
DELETE FROM orders WHERE order_id=?;

-- used for search function in front-end orders page
--- searching for a specific customer (based on inputted name) within the orders table
--- utilizes HAVING in order to search via alias of customer_name
SELECT order_id, CONCAT(customers.first_name, " ", customers.last_name) AS customer_name , CONCAT(experiences.experience_name, " ", alpacas.alpaca_name)
                            AS ea_name, ticket_quantity, order_date, order_subtotal FROM orders
                            INNER JOIN customers ON orders.customer_id = customers.customer_id
                            INNER JOIN experiences_alpacas ON orders.ea_id = experiences_alpacas.ea_id
                            INNER JOIN experiences ON experiences_alpacas.experience_id = experiences.experience_id
                            INNER JOIN alpacas ON experiences_alpacas.alpaca_id = alpacas.alpaca_id
                            HAVING customer_name LIKE ?
                            ORDER BY order_id ASC;