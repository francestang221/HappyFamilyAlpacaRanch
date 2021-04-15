// Reference: code adpated from Mengmeng Tang's CS 290 HW6 assignment
// Date: Feb 25, 2021

// ------------------- Route Handlers for Alpacas Table ------------------------

module.exports = function() {
  const express = require("express");
  const mysql = require("./dbcon.js");
  const app = express();

  // alpacas table SQL queries:
  const getAllQueryAlpacas = 'SELECT * FROM alpacas';
  const insertQueryAlpacas = 'INSERT INTO alpacas (`alpaca_name`, `age`, `breed`) VALUES (?, ?, ?)';
  const dropTableQueryAlpacas = 'DROP TABLE IF EXISTS alpacas';
  const makeTableQueryAlpacas = `CREATE TABLE alpacas(
                        alpaca_id INT(11) NOT NULL AUTO_INCREMENT,
                        alpaca_name VARCHAR(225) NOT NULL,
                        age INT(11) NOT NULL,
                        breed VARCHAR(225) NOT NULL,
                        PRIMARY KEY (alpaca_id)
                        );`;
  const updateQueryAlpacas = 'UPDATE alpacas SET alpaca_name=?, age =?, breed =? WHERE alpaca_id=?';
  const deleteQueryAlpacas = 'DELETE FROM alpacas WHERE alpaca_id=?';

  // alpacas table: get all data 
  const getAllDataAlpacas = (res) => {
    mysql.pool.query(getAllQueryAlpacas, (err, rows, fields) => {
      if (err) {
        next(err);
        return;
      }
      res.send(rows);
    });
  };


  // alpacas table: select all data - GET 
  app.get('/alpacas',function(req,res,next){
      mysql.pool.query(
        getAllQueryAlpacas, (err, rows, fields) => {
        if(err){
          next(err);
          return;
        }
        res.send(rows);
      });
    });

// alpacas table: Insert a new alpaca - POST
app.post('/alpacas',function(req,res,next){
    var {alpaca_name, age, breed} = req.body; 
    mysql.pool.query(
      insertQueryAlpacas, 
      [alpaca_name, age, breed], 
      (err, result) => {
      if(err){
        next(err);
        return;
      }
      getAllDataAlpacas(res);
    });
  });

  // alpacas table: Update data - PUT
  app.put('/alpacas',function(req,res,next){
    var {alpaca_name, age, breed, alpaca_id} = req.body; 
    mysql.pool.query(
      updateQueryAlpacas,
      [alpaca_name, age, breed, alpaca_id],
      (err, result) => {
      if(err){
        next(err);
        return;
      }
      getAllDataAlpacas(res);});
  });

  // alpacas table: Delete data - DELETE
  app.delete('/alpacas',function(req,res,next){
    var { alpaca_id } = req.body;
    mysql.pool.query(
      deleteQueryAlpacas, 
      [alpaca_id], 
      (err, result) => {
      if(err){
        next(err);
        return;
      }
      getAllDataAlpacas(res);
    });
  });

  // alpacas table: Reset table
  app.get('/reset-table',function(req,res,next){
      mysql.pool.query(dropTableQueryAlpacas, function(err){
        mysql.pool.query(makeTableQueryAlpacas, function(err){
          res.send('Table reset');
        })
      });
    });

    return app;

}();