var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConnection = require('./cmndbConnection');
var responceFile = require('../public/javascripts/responceFile');
//var sendMail = require('../public/javascripts/maillerFunction');
var moment = require('moment');


router.post('/empContactAdd', function (req, res) {
    var userID = (req.body.userID) ? req.body.userID : "";
    var contactName = (req.body.contactName) ? req.body.contactName : "";
    var mobileNo = req.body.mobileNo;
    var date = moment().format('DD-MM-YYYY');
    var resgisterUserDetails;
    dbConnection.query("SELECT * FROM usertable WHERE userMobile='" + mobileNo + "'", function (err, result, fields) {
        if (err) {
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
        }
        else if (result.length == 0) {
            responceFile.status = 401;
            responceFile.message = "This contact number not register with FriendsPath, Please ask to download this application :)";
            res.send(responceFile);
        } else if (result.length == 1) {
            resgisterUserDetails = result;
            dbConnection.query("SELECT * FROM usercontacts WHERE contactNumber ='" + mobileNo + "' && userID =" + userID, function (err, result, fields) {
                if (err) {
                    responceFile.status = 401;
                    responceFile.message = "Database Error, Please try again";
                    res.send(responceFile);
                }
                else if (result.length > 0) {
                    responceFile.status = 401;
                    responceFile.message = "Contact number already exists..";
                    res.send(responceFile);
                } else if (result.length == 0) {
                    dbConnection.query("INSERT INTO usercontacts (userID,contactName,contactNumber,createdDate,userStar, contactRegID) values (" + userID + ",'" + contactName + "','" + mobileNo + "','" + date + "', 'N', "+resgisterUserDetails[0].userID+")", function (err, result, fields) {
                        if (err) {
                            responceFile.status = 401;
                            responceFile.message = "Database Error, Please try again";
                            res.send(responceFile);
                        }
                        else if (result) {
                            responceFile.status = 200;
                            responceFile.message = "Contact added successfully";
                            res.send(responceFile);
                        }
                    });
                }
            });

        }
    });


});

router.post('/empTaskUpdate', function (req, res) {
    var task_id = req.body.task_id;
    var projectname = req.body.projectname;
    var taskname = req.body.taskname;
    var estimatedtime = req.body.estimatedtime;
    var timetaken = req.body.timetaken;
    var status = req.body.status;
    var date = req.body.date;
    var description = req.body.description;

    dbConnection.query("UPDATE addtask SET projectname='" + projectname + "',taskname='" + taskname + "',timetaken='" + timetaken + "',estimatedtime='" + estimatedtime + "',status='" + status + "',date='" + date + "',description='" + description + "' where task_id='" + task_id + "'", function (err, result, fields) {
        if (err) {
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
        } else if (result) {
            responceFile.status = 200;
            responceFile.message = "Task updated successfully";
            res.send(responceFile);
        }

    });
});

router.post('/getContactList', function (req, res) {
    var query = (req.body.userID) ? "SELECT * FROM usercontacts WHERE userID='" + req.body.userID + "' ORDER BY usercontacts.contactName DESC" : "SELECT * FROM addtask";

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

router.post('/putContactStar', function (req, res) {
    var contactID = req.body.contactID;
    var userID = req.body.userID;

    dbConnection.query('SELECT * FROM usercontacts WHERE userID=' + userID, function (err, result, fields) {
        if (err) {
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
        } else if (result) {

            for (var i = 0; i < result.length; i++) {

                if (contactID == result[i].contactID) {
                    var query = "UPDATE usercontacts SET userStar='Y' where contactID=" + contactID;
                } else {
                    var query = "UPDATE usercontacts SET userStar='N' where contactID=" + result[i].contactID;
                }

                dbConnection.query(query, function (err, result, fields) {
                    if (err) {
                        console.log("while updating contacts error : ", err);
                    } else if (result) {
                        console.log("contacts updated successfully..");
                    }

                });
            }

            var query = "SELECT * FROM usercontacts WHERE userID='" + userID + "' ORDER BY usercontacts.contactName DESC";
            dbConnection.query(query, function (err, result, fields) {
                if (err) {
                    responceFile.status = 401;
                    responceFile.message = "Database Error, Please try again";
                    res.send(responceFile);
                } else if (result) {
                    responceFile.status = 200;
                    responceFile.message = "User made Stared..";
                    responceFile.body = result;
                    res.send(responceFile);
                }

            });
        }
    })
});


router.post('/getFriendsPath', function (req, res) {
    var query = (req.body.userID) ? "SELECT * FROM usercontacts WHERE userID='" + req.body.userID + "' ORDER BY usercontacts.contactName DESC" : "SELECT * FROM addtask";

    dbConnection.query(query, function (err, result, fields) {
        if (err) {
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again == 1"+ err;
            res.send(responceFile);
        } else if (result) {
            var friendsList = "";
            var fListLeng = result.length;
            if(result.length == 1){
                friendsList = "userID = "+ result[0].contactRegID;
            }else{
                for(var i=0; i<result.length;i++){
                    if(fListLeng == i+1)
                    {
                        friendsList += "userID = "+ result[i].contactRegID;
                    }else{
                        friendsList += "userID = "+ result[i].contactRegID + " OR ";
                    }
                    
                }
            }
            
            console.log(friendsList);
            var qq = "SELECT * FROM userlatlng WHERE "+ friendsList;
            dbConnection.query(qq, function (err, result, fields) {
                if (err) {
                    responceFile.status = 401;
                    responceFile.message = "Database Error, Please try again == 2"+ err;;
                    res.send(responceFile);
                }else if (result) {
                    responceFile.status = 200;
                    responceFile.message = "";
                    responceFile.body = result;
                    res.send(responceFile);
                }
            });
            
        }

    });
});


module.exports = router;