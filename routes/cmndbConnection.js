var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : '172.30.176.228',
    port     : '3306',
    user     : 'karthivasa',
    password : 'vasa@198karthi',
    database : 'friendspathdb'
});

module.exports = connection;