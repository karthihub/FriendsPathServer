var express = require('express');
var router  = express.Router();
var mysql   = require('mysql');
var dbConnection = require('./cmndbConnection');
var responceFile = require('../public/javascripts/responceFile');
// var sendMail = require('../public/javascripts/maillerFunction');
var sendPushnotification = require('../public/javascripts/pushFunction');
var FCM = require('fcm-push');
var moment = require('moment');

router.post('/newLatLngRequest', function(req, res) {

    var userMobile;
    var userLat = req.body.lan;
    var userLng = req.body.long;
    var tempfreqID = Math.floor(Math.random() * (999999 - 1 + 000001)) + 000001;
    var userreciveID,usersentID,userreciveName;
    if(req.body.userID){
        usersentID = req.body.userID;
        userreciveName = req.body.userName;
        dbConnection.query("SELECT * FROM usercontacts WHERE userID="+req.body.userID+" && userStar='Y'", function (err, result, fields) {
            if (err){
                responceFile.status = 401;
                responceFile.message = "Database Error, Please try again";
                res.send(responceFile);
            }else if(result){
                if(result.length == 1){
                    console.log("--",result[0].contactNumber);
                    userMobile = result[0].contactNumber;

                    responceFile.body = [];
                    dbConnection.query("SELECT * FROM usertable WHERE userMobile='"+userMobile+"'", function (err, result, fields) {
                        if (err){
                            responceFile.status = 401;
                            responceFile.message = "Database Error, Please try again";
                            res.send(responceFile);
                        }
                        else if (result.length == 1){
                            var userDetails = result;
                            if(result[0].userSession == 1){
                                userreciveID = result[0].userID;
                                //userreciveName = result[0].userName;
                                var fcm = new FCM('AAAAreQgzMg:APA91bGOFhBltwgfzL1r31JXDcL-DEHohoez5yE057_pErucyof3Iy5W1MyWNHsSHNyDVN3MtJBgkIPH5Ez46Vq8CvgVYYnEb8PYX6yo_qUKkwP9NiRl-1Q_I9oJOv5VJWLJaTEhwmQ6');
                                var message = {
                                    to: result[0].fcm_tocken,
                                    collapse_key: 'Demo', 
                                    notification: {
                                        title: "New User Request",
                                        body: [{
                                            reqCoords:[{
                                                latitude : userLat,
                                                longitude : userLng
                                                }],
                                            userDetails : userDetails,
                                            message : "Your friend want to meet you..",
                                            tempfreqID : tempfreqID
                                        }],
                  
                                    }
                                };
                                //callback style
                                fcm.send(message, function(err, response){
                                    if (err) {
                                        console.log("Something has gone wrong! "+err);
                                        responceFile.status = 401;
                                        responceFile.message = "User is offline, Please try after sometime..";
                                        res.send(responceFile);
                                    } else if(response){
                                        dbConnection.query("INSERT INTO usernotificationtable (usersentID,userreciveID,userreciveName,timesTamp) values("+usersentID+","+userreciveID+",'"+userreciveName+"','"+moment().format()+"')", function (err, result, fields) {
                                            if (err) {
                                                console.log("Error while adding notification to database ==> ", err);
                                            }
                                        });
                                        dbConnection.query("INSERT INTO friendsreq (reqNumber,reqStatus) values("+tempfreqID+",'S')", function (err, result, fields) {
                                            if (err) {
                                                responceFile.status = 401;
                                                responceFile.message = "Database Error, Please try again";
                                                res.send(responceFile);
                                            }else if(result){
                                                var timeInSec = 5;
                                                var checkRequestState = setInterval(function(){ 
                                                    timeInSec += 5;
                                                    console.log("entering....", timeInSec);
                                                    dbConnection.query("SELECT * FROM friendsreq WHERE reqNumber='"+tempfreqID+"'", function (err, result, fields) {
                                                        if (err) {
                                                            responceFile.status = 401;
                                                            responceFile.message = "Database Error, Please try again";
                                                            res.send(responceFile);
                                                            clearInterval(checkRequestState);
                                                        }else if(result){
                                                            console.log("result[0].reqStatus -- ", result[0].reqStatus);
                                                            if(result[0].reqStatus == 'A'){
                                                                console.log("exit....'A'");
                                                                responceFile.status = 255;
                                                                responceFile.message = "User accepted your request";
                                                                responceFile.body = result;
                                                                console.log(responceFile);
                                                                res.send(responceFile);
                                                                clearInterval(checkRequestState);
                                                            }else if(result[0].reqStatus == 'C'){
                                                                console.log("exit....'C'");
                                                                responceFile.status = 444;
                                                                responceFile.message = "User reject your request, Please try after sometime..";
                                                                res.send(responceFile);
                                                                clearInterval(checkRequestState);
                                                            }
                                                        }
                
                                                    });
                
                                                    if(timeInSec == 60){
                                                        responceFile.status = 401;
                                                        responceFile.message = "User is offline, Please try after sometime..";
                                                        res.send(responceFile);
                                                        clearInterval(checkRequestState);
                                                    }
                                                 }, 5000);
                                            }
                                        });
                                    }
                                }); 
                            }else if(result[0].userSession == 0){
                                dbConnection.query("SELECT * FROM userlatlng where userID='"+result[0].userID+"'", function (err, result, fields) {
                                    if(err){
                                        responceFile.status = 401;
                                        responceFile.message = "Database Error, Please try again";
                                        res.send(responceFile);
                                      }
                                      else{
                                        responceFile.status = 255;
                                        responceFile.message = "User is offline, User last location is below..";
                                        responceFile.body = result;
                                        console.log(responceFile);
                                        res.send(responceFile);
                                      }                   
                                  });
                            }
                        }else{
                            responceFile.status = 401;
                            responceFile.message = "Database Error, Please try again";
                            res.send(responceFile);
                        }
                    });

                }else{
                    responceFile.status = 401;
                    responceFile.message = "No stared contact found..";
                    res.send(responceFile);
                }
                
            }
        })
    }else{
        userMobile = req.body.userMobile;

        responceFile.body = [];
        dbConnection.query("SELECT * FROM usertable WHERE userMobile='"+userMobile+"'", function (err, result, fields) {
            if (err){
                responceFile.status = 401;
                responceFile.message = "Database Error, Please try again";
                res.send(responceFile);
            }
            else if (result.length == 1){
                var userDetails = result;
                if(result[0].userSession == 1){
    
                    var fcm = new FCM('AAAAreQgzMg:APA91bGOFhBltwgfzL1r31JXDcL-DEHohoez5yE057_pErucyof3Iy5W1MyWNHsSHNyDVN3MtJBgkIPH5Ez46Vq8CvgVYYnEb8PYX6yo_qUKkwP9NiRl-1Q_I9oJOv5VJWLJaTEhwmQ6');
                    var message = {
                        to: result[0].fcm_tocken,
                        collapse_key: 'Demo', 
                        notification: {
                            title: "New User Request",
                            body: [{
                                reqCoords:[{
                                    latitude : userLat,
                                    longitude : userLng
                                    }],
                                userDetails : userDetails,
                                message : "Your friend want to meet you..",
                                tempfreqID : tempfreqID
                            }],
      
                        }
                    };
                    //callback style
                    fcm.send(message, function(err, response){
                        if (err) {
                            console.log("Something has gone wrong! "+err);
                            responceFile.status = 401;
                            responceFile.message = "User is offline, Please try after sometime..";
                            res.send(responceFile);
                        } else if(response){
                            dbConnection.query("INSERT INTO friendsreq (reqNumber,reqStatus) values("+tempfreqID+",'S')", function (err, result, fields) {
                                if (err) {
                                    responceFile.status = 401;
                                    responceFile.message = "Database Error, Please try again";
                                    res.send(responceFile);
                                }else if(result){
                                    var timeInSec = 5;
                                    var checkRequestState = setInterval(function(){ 
                                        timeInSec += 5;
                                        console.log("entering....", timeInSec);
                                        dbConnection.query("SELECT * FROM friendsreq WHERE reqNumber='"+tempfreqID+"'", function (err, result, fields) {
                                            if (err) {
                                                responceFile.status = 401;
                                                responceFile.message = "Database Error, Please try again";
                                                res.send(responceFile);
                                                clearInterval(checkRequestState);
                                            }else if(result){
                                                console.log("result[0].reqStatus -- ", result[0].reqStatus);
                                                if(result[0].reqStatus == 'A'){
                                                    console.log("exit....'A'");
                                                    responceFile.status = 255;
                                                    responceFile.message = "User accepted your request";
                                                    responceFile.body = result;
                                                    console.log(responceFile);
                                                    res.send(responceFile);
                                                    clearInterval(checkRequestState);
                                                }else if(result[0].reqStatus == 'C'){
                                                    console.log("exit....'C'");
                                                    responceFile.status = 444;
                                                    responceFile.message = "User reject your request, Please try after sometime..";
                                                    res.send(responceFile);
                                                    clearInterval(checkRequestState);
                                                }
                                            }
    
                                        });
    
                                        if(timeInSec == 60){
                                            responceFile.status = 401;
                                            responceFile.message = "User is busy now, Please try after sometime..";
                                            res.send(responceFile);
                                            clearInterval(checkRequestState);
                                        }
                                     }, 5000);
                                }
                            });
                        }
                    }); 
                }else if(result[0].userSession == 0){
                    dbConnection.query("SELECT * FROM userlatlng where userID='"+result[0].userID+"'", function (err, result, fields) {
                        if(err){
                            responceFile.status = 401;
                            responceFile.message = "Database Error, Please try again";
                            res.send(responceFile);
                          }
                          else{
                            responceFile.status = 255;
                            responceFile.message = "User is offline, User last location is below..";
                            responceFile.body = result;
                            console.log(responceFile);
                            res.send(responceFile);
                          }                   
                      });
                }
            }else{
                responceFile.status = 401;
                responceFile.message = "Database Error, Please try again";
                res.send(responceFile);
            }
        });
    }
    
    // console.log("userLat,userLng,userMobile", userLat+","+userLng+","+userMobile)

   
});



router.post('/getNotificationList', function (req, res) {
    var query = (req.body.userID) ? "SELECT * FROM usernotificationtable WHERE userreciveID='" + req.body.userID + "'" : "SELECT * FROM usernotificationtable";

    dbConnection.query(query, function (err, result, fields) {
        if (err) {
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
        } else if (result) {
            responceFile.status = 200;
            responceFile.message = "";
            responceFile.body = result;
            res.send(responceFile);
        }

    });
});

router.post('/deleteProject', function(req, res){
    var query = "DELETE from projects where id="+req.body.skein_id;

    dbConnection.query(query, function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            responceFile.body = [];
            res.send(responceFile);
        }else if(result){
            responceFile.status = 200;
            responceFile.message = "Project deleted successfully";
            responceFile.body = [];
            res.send(responceFile);
          }
        
    });
});




module.exports = router;