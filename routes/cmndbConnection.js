var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'karthivasa',
    password : 'vasa@198karthi',
    database : 'friendspathdb'
});

module.exports = connection;