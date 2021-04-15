// Reference: code adpated from Mengmeng Tang's CS 290 HW6 assignment
// Date: Feb 25, 2021

// ------------------- Route Handlers for Groups Table ------------------------

module.exports = function() {
    const express = require("express");
    const mysql = require("./dbcon.js");
    const app = express();

    // groups table SQL queries:
    const getAllQueryGrp = 'SELECT * FROM groups';
    const insertQueryGrp = 'INSERT INTO groups (`group_name`, `group_discount`) VALUES (?, ?)';
    const dropTableQueryGrp = 'DROP TABLE IF EXISTS groups';
    const makeTableQueryGrp = `CREATE TABLE groups(
                            group_id INT(11) NOT NULL AUTO_INCREMENT,
                            group_name VARCHAR(225) NOT NULL,
                            group_discount DECIMAL NOT NULL,
                            PRIMARY KEY (group_id)
                            );`;
    const updateQueryGrp = 'UPDATE groups SET group_name=?, group_discount =? WHERE group_id=?';
    const deleteQueryGrp = 'DELETE FROM groups WHERE group_id=?';


    // groups table: get all data                         
    const getAllDataGrp = (res) => {
    mysql.pool.query(getAllQueryGrp, (err, rows, fields) => {
        if (err) {
        next(err);
        return;
        }
        res.send(rows);
    });
    };

    // groups: select all data - GET 
    app.get('/groups',function(req,res,next){
        mysql.pool.query(
        getAllQueryGrp, (err, rows, fields) => {
        if(err){
            next(err);
            return;
        }
        res.send(rows);
        });
    });

    // groups table: Insert a new group - POST
    app.post('/groups',function(req,res,next){
        var {group_name, group_discount} = req.body; 
        mysql.pool.query(
        insertQueryGrp, 
        [group_name, group_discount], 
        (err, result) => {
        if(err){
            next(err);
            return;
        }
        getAllDataGrp(res);
        });
    });

    // groups table: Update data - PUT
    app.put('/groups',function(req,res,next){
    var {group_name, group_discount, group_id} = req.body; 
    mysql.pool.query(
        updateQueryGrp,
        [group_name, group_discount, group_id],
        (err, result) => {
        if(err){
        next(err);
        return;
        }
        getAllDataGrp(res);});
    });

    // groups table: Delete data - DELETE
    app.delete('/groups',function(req,res,next){
    var { group_id } = req.body;
    mysql.pool.query(
        deleteQueryGrp, 
        [group_id], 
        (err, result) => {
        if(err){
        next(err);
        return;
        }
        getAllDataGrp(res);
    });
    });

    // groups table: Reset table
    app.get('/reset-table',function(req,res,next){
        mysql.pool.query(dropTableQueryGrp, function(err){
        mysql.pool.query(makeTableQueryGrp, function(err){
            res.send('Table reset');
        })
        });
    });

  
      return app;
  
  }();