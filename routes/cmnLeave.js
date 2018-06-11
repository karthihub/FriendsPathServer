var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConnection = require('./cmndbConnection');
var responceFile = require('../public/javascripts/responceFile');
var sendPushnotification = require('../public/javascripts/pushFunction');
var sendPush;


router.post('/empApplyLeave', function(req, res){
    var skeinID = req.body.skein_id;
    var fullname = req.body.fullname;
    var leavetype = req.body.leavetype;
    var fromdate = req.body.fromdate;
    var todate = req.body.todate;
    var fromsession = req.body.fromsession;
    var tosession = req.body.tosession;
    var reason = req.body.reason;
    var color = req.body.color; 
    var pushCounts = 0; 
    var isManagers = true;      

    dbConnection.query("INSERT INTO applyleave (skein_id,fullname,leavetype,fromdate,todate,fromsession,tosession,reason,color) values ('"+skeinID+"','"+fullname+"','"+leavetype+"','"+fromdate+"','"+todate+"','"+fromsession+"','"+tosession+"','"+reason+"','"+color+"')", function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
        }else if(result){
            //responceFile.status = 200;
            //responceFile.message = "User "+skeinID+" Leave applied successfully, Please wait for HR confirmation";
            //res.send(responceFile);
            
            var notify_title = " "+skeinID+" has applied leave";
            var notify_content = "Kindly approve or reject"; 
            var category = "general";
            
            dbConnection.query("select * from skeinbook where ismanager=1", function (err, result, fields) {
             
            for(let i=0; i<result.length; i++) {
            var sendPush =  sendPushnotification(result[i].fcm_tocken, notify_title, notify_content, '', '', '', category);
            pushCounts++;   
            }

            if(pushCounts > 0){
                responceFile.status = 200;
                responceFile.message = "Notification successfully sent to "+pushCounts+ (isManagers)? " Managers " : " Employees " + "Group";
            }
            else{
                responceFile.status = 401;
                responceFile.message = "Some internal problem, Please try again";
            }
            responceFile.body = [];
            res.send(responceFile);
            });

          }
        
    });
});

router.post('/empLeaveUpdate', function(req, res){
    var id = req.body.id;
    var skeinID = req.body.skein_id;
    var fullname = req.body.fullname;
    var leavetype = req.body.leavetype;
    var fromdate = req.body.fromdate;
    var todate = req.body.todate;
    var fromsession = req.body.fromsession;
    var tosession = req.body.tosession;
    var reason = req.body.reason;
    var color = req.body.color;
    var pushCounts = 0;   

    dbConnection.query("UPDATE applyleave SET skein_id='"+skeinID+"',fullname='"+fullname+"',leavetype='"+leavetype+"',fromdate='"+fromdate+"',todate='"+todate+"',fromsession='"+fromsession+"',tosession='"+tosession+"',reason='"+reason+"',color='"+color+"' where id='"+id+"'", function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
        }else if(result){
            if (color == "red") {
            //responceFile.status = 200;
            //responceFile.message = ""+fullname+" leave has Rejected";
            //res.send(responceFile);

            var notify_title = "Rejected";
            var notify_content = "Dear "+fullname+", your leave has Rejected"; 
            var category = "general";
            
            dbConnection.query("select * from skeinbook where skein_id='"+skeinID+"' ", function (err, result, fields) {
             
            for(let i=0; i<result.length; i++) {
            var sendPush =  sendPushnotification(result[i].fcm_tocken, notify_title, notify_content, '', '', '', category);
            pushCounts++;
        }

            if (pushCounts > 0) {
                responceFile.status = 200;
                responceFile.message = "Notification successfully sent";
            }
            else {
                responceFile.status = 401;
                responceFile.message = "Some internal problem, Please try again";
            }
            responceFile.body = [];
            res.send(responceFile);
            });
        }
        else if (color == "green") {
            //responceFile.status = 200;
            //responceFile.message = ""+fullname+" leave has Approved";
            //res.send(responceFile);

            var notify_title = "Approved";
            var notify_content = "Dear "+fullname+", your leave has Approved";
            var category = "general";
            
            dbConnection.query("select * from skeinbook where skein_id='"+skeinID+"' ", function (err, result, fields) {
             
            for(let i=0; i<result.length; i++) {
            var sendPush =  sendPushnotification(result[i].fcm_tocken, notify_title, notify_content, '', '', '', category);
            pushCounts++;   
            }

            if(pushCounts > 0) {
                responceFile.status = 200;
                responceFile.message = "Notification successfully sent";
            }
            else {
                responceFile.status = 401;
                responceFile.message = "Some internal problem, Please try again";
            }
            responceFile.body = [];
            res.send(responceFile);
            });
        }
        else{

        }
          }
        
    });
});

router.post('/getEmpLeaveList', function(req, res){
    var query = (req.body.skein_id)?"SELECT * FROM applyleave WHERE skein_id='"+req.body.skein_id+"' ORDER BY applyleave.id ASC":"SELECT * FROM applyleave";

    dbConnection.query(query, function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
        }
        else if(result){
            responceFile.status = 200;
            responceFile.message = "";
            responceFile.body = result;
            res.send(responceFile);
          }
        
    });
});




module.exports = router;