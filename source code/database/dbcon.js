// Connecting to the database

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'us-cdbr-east-03.cleardb.com',
  user            : 'bcb9fa44832f0f',
  password        : 'dd68b3b3',
  database        : 'Happy Family Alpaca Ranch'
});

module.exports.pool = pool;
