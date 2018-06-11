var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConnection = require('./cmndbConnection');
var responceFile = require('../public/javascripts/responceFile');
// var sendMail = require('../public/javascripts/maillerFunction');


router.post('/empRemoveByAssignee', function(req, res){
    var skein_id = req.body.skein_id;
    responceFile.status = 0;
    responceFile.body = [];
    responceFile.message = '';

    dbConnection.query("UPDATE skeinbook SET assignedBy='',assignedDate='' where skein_id='"+skein_id+"'", function (err, result, fields) {
        if (err) {
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
        }else if(result){
            responceFile.status = 200;
            responceFile.message = "User ID [<b>"+skein_id+"</b>] successfully removed";
            res.send(responceFile);
          }
        
    });
});

router.post('/getEmpListBYAssignee', function(req, res){
    var skein_id = req.body.skein_id;
    responceFile.status = 0;
    responceFile.body = [];
    responceFile.message = '';

    dbConnection.query("SELECT * FROM skeinbook WHERE ismanager = 0 ORDER BY skeinbook.fullname ASC", function (err, result, fields) {
        if(err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
        }else if(result){
            responceFile.status = 200;
            responceFile.message = "";
            responceFile.body = result;
            res.send(responceFile);
          }
        
    });
});

module.exports = router;