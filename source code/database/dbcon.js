// Connecting to the database

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_tangmm',
  password        : '7680',
  database        : 'cs340_tangmm'
});

module.exports.pool = pool;