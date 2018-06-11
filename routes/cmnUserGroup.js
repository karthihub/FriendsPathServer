var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConnection = require('./cmndbConnection');
var moment = require('moment');
var responceFile = require('../public/javascripts/responceFile');
var sendPushnotification = require('../public/javascripts/pushFunction');
var sendPush;


router.post('/addNewUserGroup', function(req, res){
    responceFile.status = 0;
    responceFile.body = [];
    responceFile.message = '';
    var createdUserID = req.body.createdUserID;
    var fullname = JSON.stringify(req.body.fGroupMenbers);
    var groupName = req.body.groupName;
    let CurrentTimeStamp = moment().format('DD-MM-YYYY');

    console.log(createdUserID, fullname, groupName, CurrentTimeStamp);
    dbConnection.query("INSERT INTO fgrouptable (fGroupName,createdUserID,createdDate,fGroupMenbers) values ('"+groupName+"',"+createdUserID+",'"+CurrentTimeStamp+"','"+fullname+"')", function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again"+err;
            res.send(responceFile);
        }else if(result){
            responceFile.status = 200;
            responceFile.message = groupName+" Group created Successfully..";
            res.send(responceFile);
          }
        
    });
});

router.post('/updateUserGroup', function(req, res){
    responceFile.status = 0;
    responceFile.body = [];
    responceFile.message = '';
    var fGroupMenbers = JSON.stringify(req.body.fGroupMenbers);
    var groupName = req.body.groupName;
    var fGroupID = req.body.fGroupID;

    dbConnection.query("UPDATE fgrouptable SET fGroupName='"+groupName+"',fGroupMenbers='"+fGroupMenbers+"' where fGroupID="+fGroupID+"", function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
        }else if(result){
            responceFile.status = 200;
            responceFile.message = groupName+" Group updated Successfully..";
            res.send(responceFile);
          }
        
    });
});

router.post('/deleteUserGroup', function(req, res){
    var query = "DELETE from fgrouptable where fGroupID="+req.body.fGroupID+"";

    dbConnection.query(query, function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            responceFile.body = [];
            res.send(responceFile);
        }else if(result){
            responceFile.status = 200;
            responceFile.message = "Group deleted successfully..";
            responceFile.body = [];
            res.send(responceFile);
          }
        
    });
});

router.post('/getUserGroupList', function(req, res){
    var query = (req.body.createdUserID)?"SELECT * FROM fgrouptable WHERE createdUserID='"+req.body.createdUserID+"'":"SELECT * FROM fgrouptable";
    responceFile.status = 0;
    responceFile.body = [];
    responceFile.message = '';
    dbConnection.query(query, function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again"+err;
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


router.post('/getFriendsGroupLocations', function (req, res) {

            var friendsList = "";
            var fGroupMenbers = req.body.fGroupMenbers;
            var fListLeng = fGroupMenbers.length;
            if(fGroupMenbers.length == 1){
                friendsList = "userID = "+ fGroupMenbers[0].contactRegID;
            }else{
                for(var i=0; i<fGroupMenbers.length;i++){
                    if(fListLeng == i+1)
                    {
                        friendsList += "userID = "+ fGroupMenbers[i].contactRegID;
                    }else{
                        friendsList += "userID = "+ fGroupMenbers[i].contactRegID + " OR ";
                    }
                    
                }
            }
            
            console.log(friendsList);
            var qq = "SELECT * FROM userlatlng WHERE "+ friendsList;
            dbConnection.query(qq, function (err, result, fields) {
                if (err) {
                    responceFile.status = 401;
                    responceFile.message = "Database Error, Please try again == 2"+ err;
                    res.send(responceFile);
                }else if (result) {
                    responceFile.status = 200;
                    responceFile.message = "";
                    responceFile.body = result;
                    res.send(responceFile);
                }
            });
            

});




module.exports = router;