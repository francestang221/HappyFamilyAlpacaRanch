// Reference: code adpated from Mengmeng Tang's CS 290 HW6 assignment
// Date: Feb 25, 2021

// ------------------- Route Handlers for Experiences Table ------------------------

module.exports = function() {
    const express = require("express");
    const mysql = require("./dbcon.js");
    const app = express();

    // experiences table SQL queries:
    const getAllQueryExp = 'SELECT * FROM experiences';
    const insertQueryExp = 'INSERT INTO experiences (`experience_name`, `experience_price`) VALUES (?, ?)';
    const dropTableQueryExp = 'DROP TABLE IF EXISTS experiences';
    const makeTableQueryExp = `CREATE TABLE experiences(
                            experience_id INT(11) NOT NULL AUTO_INCREMENT,
                            experience_name VARCHAR(225) NOT NULL,
                            experience_price DECIMAL NOT NULL,
                            PRIMARY KEY (experience_id)
                            );`;
    const updateQueryExp = 'UPDATE experiences SET experience_name=?, experience_price =? WHERE experience_id=?';
    const deleteQueryExp = 'DELETE FROM experiences WHERE experience_id=?';

    // experiences table: get all data                         
    const getAllDataExp = (res) => {
    mysql.pool.query(getAllQueryExp, (err, rows, fields) => {
        if (err) {
        next(err);
        return;
        }
        res.send(rows);
    });
    };


    // experiences: select all data - GET 
    app.get('/experiences',function(req,res,next){
        mysql.pool.query(
        getAllQueryExp, (err, rows, fields) => {
        if(err){
            next(err);
            return;
        }
        res.send(rows);
        });
    });

    // experiences table: Insert a new experience - POST
    app.post('/experiences',function(req,res,next){
        var {experience_name, experience_price} = req.body; 
        mysql.pool.query(
        insertQueryExp, 
        [experience_name, experience_price], 
        (err, result) => {
        if(err){
            next(err);
            return;
        }
        getAllDataExp(res);
        });
    });

    // experiences table: Update data - PUT
    app.put('/experiences',function(req,res,next){
    var {experience_name, experience_price, experience_id} = req.body; 
    mysql.pool.query(
        updateQueryExp,
        [experience_name, experience_price, experience_id],
        (err, result) => {
        if(err){
        next(err);
        return;
        }
        getAllDataExp(res);});
    });

    // experiences table: Delete data - DELETE
    app.delete('/experiences',function(req,res,next){
    var { experience_id } = req.body;
    mysql.pool.query(
        deleteQueryExp, 
        [experience_id], 
        (err, result) => {
        if(err){
        next(err);
        return;
        }
        getAllDataExp(res);
    });
    });


    // experiences table: Reset table
    app.get('/reset-table',function(req,res,next){
        mysql.pool.query(dropTableQueryExp, function(err){
        mysql.pool.query(makeTableQueryExp, function(err){
            res.send('Table reset');
        })
        });
    });
    
      return app;
  
  }();