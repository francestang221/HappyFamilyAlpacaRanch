// Reference: code adpated from Mengmeng Tang's CS 290 HW6 assignment
// Date: Feb 25, 2021

const express = require("express");
const mysql = require("./dbcon.js");
var CORS = require("cors");

const app = express();
app.set("port", 6799) // port number tbd
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(CORS());

app.use('/', require('./alp.js'))
app.use('/', require('./cus.js'))
app.use('/', require('./grp.js'))
app.use('/', require('./exp.js'))
app.use('/', require('./ea.js'))
app.use('/', require('./ord.js'))


// ----------------------------------------
// error handling
app.use(function(req,res){
  res.status(404);
  res.send('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.send('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});