var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var FCM = require('fcm-push');
var dbConnection =  mysql.createConnection({
  host     : '172.30.176.228',
  port     : '3306',
  user     : 'karthivasa',
  password : 'vasa@198karthi',
  database : 'friendspathdb'
});
var sendPush = require('../public/javascripts/pushFunction');
var responceFile = require('../public/javascripts/responceFile');
var sendMail = require('../public/javascripts/maillerFunction');
var moment = require('moment');

router.post('/useAuthendication', function(req, res){

      let enteredUserName = req.body.userName;
      let enteredPassword = req.body.password;
      let userLatitude = req.body.latitude;
      let userLongitude = req.body.longitude;
      let userDeviceTocken = req.body.deviceUUID;
      let fcm_tocken = req.body.fcmTocken;
      let CurrentTimeStamp = moment().format();
      responceFile.status = 0;
      responceFile.body = [];
      responceFile.message = '';


          dbConnection.query("SELECT * FROM usertable where userName='"+enteredUserName+"'", function (err, result, fields) {
            if (err) {
              responceFile.status = 401;
              responceFile.message = "Database Error, Please try again"+ err;
            }
            else if(!result.length){
              responceFile.status = 401;
              responceFile.message = "This user ID "+enteredUserName+" is not Registered";
            }else if(enteredPassword != result[0].password || enteredUserName != result[0].userName){
              responceFile.status = 401;
              responceFile.message = "Please enter valid Password";
            }
            else if(result[0].userStatus == 'R'){
              responceFile.status = 401;
              responceFile.message = "Your account is not Activated. Please contact ADMIN department";
            }
            else if(result[0].userStatus == 'HO'){
              responceFile.status = 401;
              responceFile.message = "Your account is Hold. Please contact ADMIN department";
            }
            else if(result[0].userStatus == 'A'){
              var userIDTemp = result[0].userID;
              var userNameTemp = result[0].userName;
              dbConnection.query("SELECT * FROM userlatlng where userID='"+result[0].userID+"'", function (err, result, fields) {
                if(result){
                  if(!result.length){
                    dbConnection.query("INSERT INTO userlatlng (userID,userLat,userLng,timesTamp,userName) values('"+userIDTemp+"','"+userLatitude+"','"+userLongitude+"','"+CurrentTimeStamp+"', '"+userNameTemp+"')", function (err, result, fields) {
                      if(result){
                          console.log("User current timestamp Added..")
                        }
                    });
                  }else if(result.length == 1 && userLatitude != undefined && userLongitude != undefined){
                    dbConnection.query("UPDATE userlatlng SET userLat='"+userLatitude+"',userLng='"+userLongitude+"',timesTamp='"+CurrentTimeStamp+"' where userID='"+result[0].userID+"'", function (err, result, fields) {
                      if(result){
                          console.log("User current timestamp Added..", fcm_tocken);
                      }
                    });
                    dbConnection.query("UPDATE usertable SET fcm_tocken='"+fcm_tocken+"', userSession=1 where userID='"+userIDTemp+"'", function (err, result, fields) {
                      if(result){
                        console.log("User fTocken is Updated...");
                      }
                    });
                  }
                }
                else if(err){
                  console.log("User current timestamp not Added==>>> ", err)
                }

              });
              responceFile.status = 200;
              responceFile.message = "Login Successfully";
              responceFile.body = result;
            }
            res.send(responceFile);
          });

    //sendPush('f9uyUywc8qw:APA91bE0xDA6M13pfYWwreU9WPiTWDl3uzRU0n2sJxbSBZ1PeRe2pKfu56DsegHQGoPmEWPWM8vcH3pAFW_c-DKrPSYGBgeR4gkdeJkWi2tY-Iujlkmx_cowO1D7zqYATZYu1RyXgGZL');

});

router.post('/generateOtp', function(req, res){

  let otpGenerate = Math.floor(100000 + Math.random() * 900000);
  let userDeviceTocken = req.body.userDeviceTocken;

  dbConnection.query("SELECT * FROM usertable where userDeviceTocken='"+userDeviceTocken+"'", function (err, result, fields) {
      if (err) {
        responceFile.status = 401;
        responceFile.message = "Database Error, Please try again";
        res.send(responceFile);
      }
      else if(!result.length){
        responceFile.status = 401;
        responceFile.message = "You are not Registered with FriendsPath, Please SignUP..";
        res.send(responceFile);
      }
      else if (result.length == 1){
        var tempUserDTL =  result[0];
        console.log(tempUserDTL);
        dbConnection.query("UPDATE usertable SET userCurrentOTP='"+otpGenerate+"' where userDeviceTocken='"+userDeviceTocken+"'", function (err, result, fields) {
          if (err) {
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
          }
          else {
            var fcm = new FCM('AAAAreQgzMg:APA91bGOFhBltwgfzL1r31JXDcL-DEHohoez5yE057_pErucyof3Iy5W1MyWNHsSHNyDVN3MtJBgkIPH5Ez46Vq8CvgVYYnEb8PYX6yo_qUKkwP9NiRl-1Q_I9oJOv5VJWLJaTEhwmQ6');
            var message = {
                to: tempUserDTL.fcm_tocken,
                collapse_key: 'Demo', 

                notification: {
                    title: 'Forgot Password',
                    body: 'Your six-digits OTP is '+otpGenerate
                }
            };
            
            //callback style
            fcm.send(message, function(err, response){
                if (err) {
                    console.log("Something has gone wrong!"+err);
                    responceFile.status = 401;
                    responceFile.message = "Database Error, Please try again";
                    res.send(responceFile);
                } else if(response){
                    console.log("Successfully sent with response: ", response); 
                    responceFile.status = 200;
                    responceFile.message = "Six-digit OTP has sent as Notification..";
                    res.send(responceFile);  
                }
            });

          }
        });
      }
      
    });
 
});


router.post('/useForgotPass', function(req, res){
  
  let userDeviceTocken = req.body.deviceUUID;
  let enteredOTP = req.body.otp;
  let enteredPassword = req.body.newPassword;

    dbConnection.query("SELECT * FROM usertable where userCurrentOTP="+enteredOTP+" && userDeviceTocken='"+userDeviceTocken+"'", function (err, result, fields) {
      if (err) {
        responceFile.status = 401;
        responceFile.message = "Database Error, Please try again"+err;
        res.send(responceFile);
      }
      else if(!result.length){
        responceFile.status = 401;
        responceFile.message = "Please enter Valid OTP";
        res.send(responceFile);
      }
      else if(result.length == 1){
        dbConnection.query("UPDATE usertable SET password='"+enteredPassword+"' where userDeviceTocken='"+userDeviceTocken+"'" , function (err, result, fields) {
          if (err) {
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
          }else{
            responceFile.status = 200;
            responceFile.message = "Password has successfully updated, Please login";
            res.send(responceFile);
          }
        });
      }
      
    });
 
});


router.post('/updateLatLngRequest', function(req, res){
  var reqStatus = req.body.reqStatus;
  var userLat = req.body.userLat;
  var userLng  = req.body.userLng;
  var reqNumber = req.body.reqNumber;
  var userName = req.body.userName;

  console.log("reqStatus, userLat, userLng, reqNumber, userName -> ", reqStatus, userLat, userLng, reqNumber, userName);


  dbConnection.query("UPDATE friendsreq SET userName='"+userName+"',reqStatus='"+reqStatus+"',userLat='"+userLat+"',userLng='"+userLng+"' where reqNumber='"+reqNumber+"'", function (err, result, fields) {
      if (err){
          responceFile.status = 401;
          responceFile.message = "Database Error, Please try again";
          responceFile.body = [];
          res.send(responceFile);
      }else if(result){
          responceFile.status = 200;
          responceFile.message = "Task updated successfully";
          responceFile.body = [];
          res.send(responceFile);
        }
  });
});


router.post('/userLogout', function(req, res){
  let userDeviceTocken = req.body.userDeviceTocken;

  dbConnection.query("UPDATE usertable SET userSession=0 where userDeviceTocken='"+userDeviceTocken+"'", function (err, result, fields) {
      if (err){
          responceFile.status = 401;
          responceFile.message = "Database Error, Please try again";
          responceFile.body = [];
          res.send(responceFile);
      }else if(result){
          responceFile.status = 200;
          responceFile.message = "Logout successfully..";
          responceFile.body = [];
          res.send(responceFile);
        }
  });
});

module.exports = router;