var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    // port     : '8443',
    user     : 'root',
    password : '',
    database : 'friendspathdb'
});

module.exports = connection;