// Reference: code adpated from Mengmeng Tang's CS 290 HW6 assignment
// Date: Feb 25, 2021

// ------------------- Route Handlers for Alpacas-Experiences Table ------------------------

module.exports = function() {
    const express = require("express");
    const mysql = require("./dbcon.js");
    const app = express();
  
    // groups table SQL queries:
    // need to add delete and update queries for step 6
    const getAllQueryExpAlp = 'SELECT * FROM experiences_alpacas';
    const insertQueryExpAlp = 'INSERT INTO experiences_alpacas (`experience_id`, `alpaca_id`) VALUES (?, ?)';
    const dropTableQueryExpAlp = 'DROP TABLE IF EXISTS experiences_alpacas';
    const makeTableQueryExpAlp = `CREATE TABLE experiences_alpacas(
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
                            );`;
    const getJoinedQuery = `SELECT ea_id, experiences_alpacas.experience_id, experiences_alpacas.alpaca_id, experiences.experience_name, alpacas.alpaca_name FROM experiences_alpacas
                            INNER JOIN experiences ON experiences_alpacas.experience_id = experiences.experience_id
                            INNER JOIN alpacas ON experiences_alpacas.alpaca_id = alpacas.alpaca_id
                            ORDER BY ea_id ASC`;
    const updateQueryExpAlp = 'UPDATE experiences_alpacas SET experience_id =?, alpaca_id =? WHERE ea_id =?';
    const deleteQueryExpAlp = 'DELETE FROM experiences_alpacas WHERE ea_id =?';

    // experiences_alpacas table: get all data                         
    const getAllDataExpAlp = (res) => {
    mysql.pool.query(getJoinedQuery, (err, rows, fields) => {
        if (err) {
        next(err);
        return;
        }
        res.send(rows);
    });
    };

    // experiences_alpacas table: select all joined data - GET 
    app.get('/experiences-alpacas',function(req,res,next){
        mysql.pool.query(
        getJoinedQuery, (err, rows, fields) => {
        if(err){
            next(err);
            return;
        }
        res.send(rows);
        });
    });

    // experiences_alpacas table: Insert a new group - POST
    app.post('/experiences-alpacas', function(req,res,next){
        var {experience_id, alpaca_id} = req.body; 
        mysql.pool.query(
        insertQueryExpAlp, 
        [experience_id, alpaca_id], 
        (err, result) => {
        if(err){
            next(err);
            return;
        }
        getAllDataExpAlp(res);
        });
    });

    // experiences_alpacas table: Update data - PUT
    app.put('/experiences-alpacas', function(req,res,next){
        var {experience_id, alpaca_id, ea_id} = req.body;
        mysql.pool.query(
        updateQueryExpAlp,
        [experience_id, alpaca_id, ea_id],
        (err, result) => {
            if(err){
            next(err);
            return;
            }
        getAllDataExpAlp(res);
        });
    });

    // experiences_alpacas table: Delete data - DELETE
    app.delete('/experiences-alpacas', function(req,res,next){
        var {ea_id} = req.body;
        mysql.pool.query(
        deleteQueryExpAlp,[ea_id], (err, result) => {
            if(err){
            next(err);
            return;
            }
            getAllDataExpAlp(res);
        });
    });

    // experiences_alpacas table: Reset table
    app.get('/reset-table',function(req,res,next){
        mysql.pool.query(dropTableQueryExpAlp, function(err){
        mysql.pool.query(makeTableQueryExpAlp, function(err){
            res.send('Table reset');
        })
        });
    });
                     
      return app;
  
  }();