var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : '127.0.0.1',
    port     : '3306',
    user     : 'karthivasa',
    password : 'vasa@198karthi',
    database : 'friendspathdb'
});

module.exports = connection;