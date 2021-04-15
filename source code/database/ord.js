// Reference: code adpated from Mengmeng Tang's CS 290 HW6 assignment
// Date: Feb 25, 2021

// ------------------- Route Handlers for Orders Table ------------------------

module.exports = function() {
    const express = require("express");
    const mysql = require("./dbcon.js");
    const app = express();    

    // orders table SQL queries:
    const getJoinedQueryOrd = `SELECT order_id, CONCAT(customers.first_name, " ",customers.last_name) AS customer_name , CONCAT(experiences.experience_name, " ", alpacas.alpaca_name) AS ea_name, ticket_quantity, order_date, order_subtotal FROM orders
                            INNER JOIN customers ON orders.customer_id = customers.customer_id
                            INNER JOIN experiences_alpacas ON orders.ea_id = experiences_alpacas.ea_id
                            INNER JOIN experiences ON experiences_alpacas.experience_id = experiences.experience_id
                            INNER JOIN alpacas ON experiences_alpacas.alpaca_id = alpacas.alpaca_id
                            ORDER BY order_id ASC`;
    const insertQueryOrd = 'INSERT INTO orders (`customer_id`, `ea_id`, `ticket_quantity`, `order_date`, `order_subtotal`) VALUES (?, ?, ?, ?, ?)';
    const dropTableQueryOrd = 'DROP TABLE IF EXISTS orders';
    const makeTableQueryOrder = `SELECT order_id, CONCAT(customers.first_name, " ",customers.last_name) AS customer_name , CONCAT(experiences.experience_name, " ", alpacas.alpaca_name) AS ea_name, ticket_quantity, order_date, order_subtotal FROM orders
                            INNER JOIN customers ON orders.customer_id = customers.customer_id
                            INNER JOIN experiences_alpacas ON orders.ea_id = experiences_alpacas.ea_id
                            INNER JOIN experiences ON experiences_alpacas.experience_id = experiences.experience_id
                            INNER JOIN alpacas ON experiences_alpacas.alpaca_id = alpacas.alpaca_id
                            ORDER BY order_id ASC`;
    const deleteQueryOrd = 'DELETE FROM orders WHERE order_id=?';

    // queries to different tables
    const getQueryCus = 'SELECT customer_id, CONCAT(first_name, " ", last_name) AS customer_name FROM customers ORDER BY customer_name ASC';
    const getQueryEA = 'SELECT ea_id, CONCAT(experiences.experience_name, " ", alpacas.alpaca_name) AS ea_name FROM experiences_alpacas INNER JOIN experiences ON experiences_alpacas.experience_id = experiences.experience_id INNER JOIN alpacas ON experiences_alpacas.alpaca_id = alpacas.alpaca_id ORDER BY ea_name ASC';
    
    const getQueryGroupDis = 'SELECT (IFNULL(groups.group_discount,0)) AS group_discount FROM customers LEFT JOIN groups ON customers.group_id = groups.group_id WHERE customer_id =?';
    const getQueryExpPrice = 'SELECT experiences.experience_price FROM experiences_alpacas INNER JOIN experiences ON experiences_alpacas.experience_id = experiences.experience_id WHERE ea_id =?';

    // query for order's searchTable
    // utilized HAVING instead of WHERE, in order to search the combinated customer_name alias
    const getQuerySearch = `SELECT order_id, CONCAT(customers.first_name, " ", customers.last_name) AS customer_name , CONCAT(experiences.experience_name, " ", alpacas.alpaca_name) AS ea_name, ticket_quantity, order_date, order_subtotal FROM orders 
                            INNER JOIN customers ON orders.customer_id = customers.customer_id 
                            INNER JOIN experiences_alpacas ON orders.ea_id = experiences_alpacas.ea_id 
                            INNER JOIN experiences ON experiences_alpacas.experience_id = experiences.experience_id 
                            INNER JOIN alpacas ON experiences_alpacas.alpaca_id = alpacas.alpaca_id 
                            HAVING customer_name LIKE ?
                            ORDER BY order_id ASC`;
    
    

    // orders table: get all data                         
    const getAllDataOrd = (res) => {
    mysql.pool.query(getJoinedQueryOrd, (err, rows, fields) => {
        if (err) {
        next(err);
        return;
        }
        res.send(rows);
    });
    };

    // orders table: Delete data - DELETE
    app.delete('/orders',function(req,res,next){
        var {order_id} = req.body;
        mysql.pool.query(
        deleteQueryOrd, 
        [order_id], 
        (err, result) => {
        if(err){
        next(err);
        return;
        }
        getAllDataOrd(res);
    });
  });

    // orders table: Insert data - INSERT
    app.post('/orders',function(req,res,next){
        // set up counter to ensure that both queries run before starting actual INSERT query
        data = {};
        counter = 0;
        var {customer_id, ea_id, ticket_quantity, order_date} = req.body;

        mysql.pool.query(
            // 1st query - find new order's customer's group_discount (if group_id == NULL, then will have answer be 0)
            getQueryGroupDis, [customer_id], (err, rows, fields) => {
                if(err){
                next(err);
                return;
                }
                let data1 = rows;
                let group_discount = data1[0].group_discount;
                counter += 1

                mysql.pool.query(
                    // 2nd query - find new order's experience's price
                    getQueryExpPrice, [ea_id], (err, rows,fields) => {
                        if(err){
                        next(err);
                        return;
                        }
                        let data2 = JSON.parse(JSON.stringify(rows));
                        let exp_price = data2[0].experience_price
                        counter += 1

                        // calculate the order_subtotal
                        let order_subtotal = (ticket_quantity * exp_price * (1 - group_discount * 0.01));

                        if (counter == 2) {
                            // 3rd query - INSERT into the table with the calculated order_subtotal
                            mysql.pool.query(
                                insertQueryOrd,
                                [customer_id, ea_id, ticket_quantity, order_date, order_subtotal],
                                (err, result) => {
                                    if(err){
                                        next(err);
                                        return;
                                    }
                                getAllDataOrd(res);
                                }
                            )
                        }

                    }

                )
            }
        )
    });

    // orders table: Select all joined data - GET 
    // will make 3 queries (orders, customers, experiences_alpaca)
    app.get('/orders',function(req,res,next){
        data = {};
        counter = 0;

        mysql.pool.query(
        // 1st query - orders table
            getJoinedQueryOrd, (err, rows, fields) => {
            if(err){
            next(err);
            return;
            }
            data.ord = rows;
            counter += 1;

            mysql.pool.query(
                //2nd query - customers table
                getQueryCus, (err, rows, fields) => {
                    if(err){
                    next(err);
                    return;
                    }
                    data.cus = rows;
                    counter += 1;

                    // if (counter == 2){
                    //     res.send(data);
                    // }

                    mysql.pool.query(
                        //3rd query - experiences_alpaca table
                        getQueryEA, (err, rows, fields) => {
                            if(err){
                                next(err);
                                return;
                            }
                            data.ea = rows;
                            counter += 1;
                            
                            if (counter == 3) {
                                res.send(data);
                            }
                        }
                    )
                }
            )
        });
    });

    // orders search query
    app.post('/orders-search', function(req,res,next){
        // searches through current order's customers for both first and last name
        var {search} = req.body;
        
        // will use literal template in order to search for any matches of the search_string
        // i.e. %search_string%
        let search_string = `%${search}%`
        mysql.pool.query(
            getQuerySearch, [search_string], (err, result, fields) => {
                if(err){
                    next(err);
                    return;
                }
                res.send(result);
            }
        )
    });

    return app;

}();