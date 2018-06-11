var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConnection = require('./cmndbConnection');
var responceFile = require('../public/javascripts/responceFile');
var sendPushnotification = require('../public/javascripts/pushFunction');
var sendPush;

router.post('/notifyAdd', function(req, res){
    var message_id = "";
    var multicast_id = "";
    var fromSkeinID = (req.body.fromSkeinID) ? req.body.fromSkeinID : "";
    var toSkeinID = (req.body.toSkeinID) ? req.body.toSkeinID : "";
    var notify_title = (req.body.notify_title) ? req.body.notify_title : "";
    var notify_content = (req.body.notify_content) ? req.body.notify_content : "";
    var notify_content_srt = (req.body.notify_content.length > 30) ? req.body.notify_content.slice(0, 30) : req.body.notify_content;
    var readData = 1;
    var date = new Date("YYYY-MM-DD");
    var isManagers = (req.body.isManagers) ? true : false;
    var isEmployees = (req.body.isEmployees) ? true : false;
    var specId = (req.body.specId) ? true : false;
    var category = req.body.category;
    var pushCounts = 0;

    if(isManagers){
        dbConnection.query("select * from skeinbook where ismanager=1", function (err, result, fields) {
            if (err){
                responceFile.status = 401;
                responceFile.message = "Database Error, Please try again";
                responceFile.body = [];
                res.send(responceFile);
            }else if(result){

                for(let i=0; i<result.length; i++){

                    console.log("result" + result);
                    console.log("token" + result[i].fcm_tocken);
                    console.log("title" + notify_title);
                    console.log("content" + notify_content);
                    console.log("content" + category);

                   var sendPush =  sendPushnotification(result[i].fcm_tocken, notify_title, notify_content, notify_content_srt, fromSkeinID, toSkeinID, category);
                //    if(sendPush.success == 1){
                        // multicast_id  = sendPush.multicast_id;
                        // message_id  = sendPush.results[0].message_id;
                        // dbConnection.query("INSERT INTO `notifications`(`message_id`, `multicast_id`, `notify_title`, `notify_content`, `notify_content_srt`, `readData`, `date`, `from_skein_id`, `to_skein_id`) VALUES ('"+message_id+"', '"+multicast_id+"', '"+notify_title+"', '"+notify_content+"', '"+notify_content_srt+"', "+read+", '"+date+"', '"+fromSkeinID+"', '"+toSkeinID+"')", function (err, result, fields) {
                        //     if (err){

                        //     }else if(result){
                                pushCounts++;
                        //     }
                        // });
                //    }
                }

                if(pushCounts > 0){
                    responceFile.status = 200;
                    responceFile.message = "Notification successfully sent to "+pushCounts+ (isManagers)? " Managers " : " Employees " + "Group";
                }else{
                    responceFile.status = 401;
                    responceFile.message = "Some internal problem, Please try again";
                }
                responceFile.body = [];
                res.send(responceFile);
            }
            
        });
    }if(isEmployees){
        dbConnection.query("select * from skeinbook where ismanager=0", function (err, result, fields) {
            if (err){
                responceFile.status = 401;
                responceFile.message = "Database Error, Please try again";
                responceFile.body = [];
                res.send(responceFile);
            }else if(result){

                for(let i=0; i<result.length; i++){

                   var sendPush =  sendPushnotification(result[i].fcm_tocken, notify_title, notify_content, notify_content_srt, fromSkeinID, toSkeinID, category);
                //    if(sendPush.success == 1){
                //         multicast_id  = sendPush.multicast_id;
                //         message_id  = sendPush.results[0].message_id;
                //         dbConnection.query("INSERT INTO `notifications`(`message_id`, `multicast_id`, `notify_title`, `notify_content`, `notify_content_srt`, `readData`, `date`, `from_skein_id`, `to_skein_id`) VALUES ('"+message_id+"', '"+multicast_id+"', '"+notify_title+"', '"+notify_content+"', '"+notify_content_srt+"', "+read+", '"+date+"', '"+fromSkeinID+"', '"+toSkeinID+"')", function (err, result, fields) {
                //             if (err){

                //             }else if(result){
                                pushCounts++;
                //             }
                //         });
                //    }
                }

                if(pushCounts > 0){
                    responceFile.status = 200;
                    responceFile.message = "Notification successfully sent to "+pushCounts+ (isManagers)? " Managers " : " Employees " + "Group";
                }else{
                    responceFile.status = 401;
                    responceFile.message = "Some internal problem, Please try again";
                }
                responceFile.body = [];
                res.send(responceFile);
            }
            
        });
    }else if(toSkeinID != ""){


        dbConnection.query("select * from skeinbook where skein_id='"+toSkeinID+"'", function (err, result, fields) {
            if (err){
                responceFile.status = 401;
                responceFile.message = "Database Error, Please try again";
                responceFile.body = [];
                res.send(responceFile);
            }else if(result){

                for(let i=0; i<result.length; i++){

                    console.log("result" + result);
                    console.log("token" + result[i].fcm_tocken);
                    console.log("title" + notify_title);
                    console.log("content" + notify_content);
                    console.log("content" + category);

                   sendPush =  sendPushnotification(result[i].fcm_tocken, notify_title, notify_content, notify_content_srt, fromSkeinID, toSkeinID, category);
                //    var intervalObj = setInterval(() => {
                    console.log(sendPush);
                    // if(sendPush.success == 1){
                    //             multicast_id  = sendPush.multicast_id;
                    //             message_id  = sendPush.results[0].message_id;
                    //             dbConnection.query("INSERT INTO `notifications`(`message_id`, `multicast_id`, `notify_title`,
                    //              `notify_content`, `notify_content_srt`, `readData`, `date`, `from_skein_id`, `to_skein_id`) VALUES ('"+message_id+"', '"+multicast_id+"', '"+notify_title+"', '"+notify_content+"', '"+notify_content_srt+"', "+read+", '"+date+"', '"+fromSkeinID+"', '"+toSkeinID+"')", function (err, result, fields) {
                    //                 if (err){
        
                    //                 }else if(result){
                                        pushCounts++;
                    //                 }
                    //             });
                    //        }
                //   }, 6000);
                }

                if(pushCounts > 0){
                    responceFile.status = 200;
                    responceFile.message = "Notification successfully sent to "+pushCounts+ (isManagers)? " Managers " : " Employees " + "Group";
                }else{
                    responceFile.status = 401;
                    responceFile.message = "Some internal problem, Please try again";
                }
                responceFile.body = [];
                res.send(responceFile);
            }
            
        });
    }
});

router.post('/notifyUpdate', function(req, res){

    dbConnection.query("UPDATE notifications SET readData="+req.body.read+" where message_id='"+req.body.message_id+"'", function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again"+err;
            res.send(responceFile);
        }else if(result){
            responceFile.status = 200;
            responceFile.message = "";
            res.send(responceFile);
          }
        
    });
});

router.post('/getnotifyList', function(req, res){
    var query = (req.body.skein_id)?"SELECT * FROM notifications WHERE to_skein_id='"+req.body.skein_id+"' ORDER BY date DESC LIMIT 0 , 30":"SELECT * FROM notifications";

    dbConnection.query(query, function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            responceFile.body = [];
            res.send(responceFile);
        }else if(result){
            responceFile.status = 200;
            responceFile.message = "";
            responceFile.body = result;
            res.send(responceFile);
          }
        
    });
});

router.post('/deleteNotify', function(req, res){
    var query = "DELETE from notifications where message_id='"+req.body.message_id+"'";

    dbConnection.query(query, function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            responceFile.body = [];
            res.send(responceFile);
        }else if(result){
            responceFile.status = 200;
            responceFile.message = "Notification deleted successfully";
            responceFile.body = [];
            res.send(responceFile);
          }
        
    });
});


module.exports = router;