DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS alpacas;
DROP TABLE IF EXISTS experiences;
DROP TABLE IF EXISTS experiences_alpacas;
DROP TABLE IF EXISTS orders;

-- Create groups table
-- Relationship(s): groups has 1:M relationship with customers
CREATE TABLE groups(
    group_id INT(11) NOT NULL AUTO_INCREMENT,
    group_name VARCHAR(225) NOT NULL,
    group_discount DECIMAL NOT NULL,
    PRIMARY KEY (group_id)
);
-- Insert sample data into groups table
INSERT INTO groups (group_name, group_discount) VALUES
("Senior", 20),
("Holiday", 15),
("Student", 10),
("Veteran", 25);


-- Create customers table
-- Relationship(s): customers has 1:M relationship with groups; customers has 1:M relationship with orders
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
-- Insert sample data into customers table
INSERT INTO customers (first_name, last_name, email, group_id) VALUES
("Stephen", "Strange", "strangephdmd@supremesorcery.com",(SELECT group_id FROM `groups` WHERE group_name = "Holiday"));

INSERT INTO customers (first_name, last_name, email, group_id) VALUES
("King", "T'Challa", "bpanther@wakanda.org", null);

INSERT INTO customers (first_name, last_name, email, group_id) VALUES
("Peter", "Parker", "peterparker@midtownhs.edu", (SELECT group_id FROM `groups` WHERE group_name = "Student"));

INSERT INTO customers (first_name, last_name, email, group_id) VALUES
("Steve", "Rogers", "captainamerica@avengers.com", (SELECT group_id FROM `groups` WHERE group_name = "Veteran"));


-- Create alpacas table
-- Relationship(s): alpacas has M:M relationship with experiences (with experiences_alpacas as the intersection table)
CREATE TABLE alpacas(
    alpaca_id INT(11) NOT NULL AUTO_INCREMENT,
    alpaca_name VARCHAR(225) NOT NULL,
    age INT(11) NOT NULL,
    breed VARCHAR(225) NOT NULL,
    PRIMARY KEY (alpaca_id)
);
-- Insert sample data into alpacas table
INSERT INTO alpacas (alpaca_name, age, breed) VALUES
("Cocoa", "7", "Suri"),
("Meringue", "20", "Huacaya"),
("Sprinkles", "6", "Huacaya"),
("Caramel", "12", "Huacaya");


-- Create experiences table
-- Relationship(s): experiences has M:M relationship with alpacas (with experiences_alpacas as the intersection table)
CREATE TABLE experiences(
    experience_id INT(11) NOT NULL AUTO_INCREMENT,
    experience_name VARCHAR(225) NOT NULL,
    experience_price DECIMAL NOT NULL,
    PRIMARY KEY (experience_id)
);
-- Insert sample data into experiences table
INSERT INTO experiences (experience_name, experience_price) VALUES
("Feeding", 10),
("Touring", 20),
("Grooming", 15);


-- Create experiences_alpacas table
-- Relationship(s): experiences_alpacas has 1:M relationship with orders
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
-- Insert sample data into the experiences_alpacas table
INSERT INTO experiences_alpacas (experience_id, alpaca_id) VALUES
((SELECT experience_id FROM experiences WHERE experience_name = "Feeding"), (SELECT alpaca_id FROM alpacas WHERE alpaca_name = "Meringue")),
((SELECT experience_id FROM experiences WHERE experience_name = "Feeding"), (SELECT alpaca_id FROM alpacas WHERE alpaca_name = "Cocoa")),
((SELECT experience_id FROM experiences WHERE experience_name = "Touring"), (SELECT alpaca_id FROM alpacas WHERE alpaca_name = "Sprinkles"));


-- Create orders table
-- Relationship(s): orders has 1:M relationship with customer and experiences_alpacas
CREATE TABLE orders(
    order_id INT(11) NOT NULL AUTO_INCREMENT,
    customer_id INT(11) NOT NULL,
    ea_id INT(11) NOT NULL,
    ticket_quantity INT(11) NOT NULL,
    order_date DATE NOT NULL,
    order_subtotal DECIMAL NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (ea_id)
        REFERENCES experiences_alpacas(ea_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
-- Insert sample data into the orders table
INSERT INTO orders (customer_id, ea_id, ticket_quantity, order_date, order_subtotal) VALUES
((SELECT customer_id FROM customers WHERE last_name = "Strange"), (SELECT ea_id FROM experiences_alpacas WHERE ea_id = 1), 2, "2020-10-25",
(2 * (SELECT experience_price FROM experiences WHERE experience_name = "Feeding") * (1 - (SELECT group_discount FROM groups WHERE group_name = "Holiday") * 0.01))),
((SELECT customer_id FROM customers WHERE first_name = "King"), (SELECT ea_id FROM experiences_alpacas WHERE ea_id = 2), 1, "2020-11-13",
(1 * (SELECT experience_price FROM experiences WHERE experience_name = "Feeding"))),
((SELECT customer_id FROM customers WHERE last_name = "Parker"), (SELECT ea_id FROM experiences_alpacas WHERE ea_id = 3), 2, "2020-10-25",
(3 * (SELECT experience_price FROM experiences WHERE experience_name = "Touring") * (1 - (SELECT group_discount FROM groups WHERE group_name = "Student") * 0.01)));