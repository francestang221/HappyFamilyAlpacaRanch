// Reference: code adpated from Mengmeng Tang's CS 290 HW6 assignment
// Date: Feb 25, 2021

// ------------------- Route Handlers for Customers Table ------------------------

module.exports = function() {
    const express = require("express");
    const mysql = require("./dbcon.js");
    const app = express();
  
    // customers table SQL queries:
    // need to add delete and update queries for step 6
    const getAllQueryCus = 'SELECT * FROM customers';
    const insertQueryCus = 'INSERT INTO customers (`first_name`, `last_name`, `email`, `group_id`) VALUES (?, ?, ?, ?)';
    const dropTableQueryCus = 'DROP TABLE IF EXISTS customers';
    const makeTableQueryCus = `CREATE TABLE customers(
                        customer_id INT(11) NOT NULL AUTO_INCREMENT,
                        first_name VARCHAR(225) NOT NULL,
                        last_name VARCHAR(225) NOT NULL,
                        email VARCHAR(225) NOT NULL,
                        group_id INT(11) NULL,
                        PRIMARY KEY (customer_id),
                        FOREIGN KEY (group_id)
                        REFERENCES groups(group_id)
                        );`;
    const updateQueryCus = 'UPDATE customers SET first_name=?, last_name=?, email=? WHERE customer_id=?';
    const deleteQueryCus = 'DELETE FROM customers WHERE customer_id=?';

    // customers table: get all data                         
    const getAllDataCus = (res) => {
    mysql.pool.query(getAllQueryCus, (err, rows, fields) => {
        if (err) {
        next(err);
        return;
        }
        res.send(rows);
    });
    };

    // customers: select all data - GET 
    app.get('/customers',function(req,res,next){
        mysql.pool.query(
        getAllQueryCus, (err, rows, fields) => {
        if(err){
            next(err);
            return;
        }
        res.send(rows);
        });
    });

    // customers table: Insert a new customer - POST
    app.post('/customers',function(req,res,next){
        var {first_name, last_name, email, group_id} = req.body; 
        mysql.pool.query(
        insertQueryCus, 
        [first_name, last_name, email, group_id], 
        (err, result) => {
        if(err){
            next(err);
            return;
        }
        getAllDataCus(res);
        });
    });

    // // customers table: Update data - PUT
    // app.put('/customers',function(req,res,next){
    // var {first_name, last_name, email, customer_id} = req.body; 
    // mysql.pool.query(
    //     updateQueryCus,
    //     [first_name, last_name, email],
    //     (err, result) => {
    //     if(err){
    //     next(err);
    //     return;
    //     }
    //     getAllDataCus(res);});
    // });

    // customers table: Delete data - DELETE
    app.delete('/customers',function(req,res,next){
    var { customer_id } = req.body;
    mysql.pool.query(
        deleteQueryCus, 
        [customer_id], 
        (err, result) => {
        if(err){
        next(err);
        return;
        }
        getAllDataCus(res);
    });
    });

    // customers table: Reset table
    app.get('/reset-table',function(req,res,next){
        mysql.pool.query(dropTableQueryCus, function(err){
        mysql.pool.query(makeTableQueryCus, function(err){
            res.send('Table reset');
        })
        });
    });
  
      return app;
  
  }();