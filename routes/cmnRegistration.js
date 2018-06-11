var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConnection = require('./cmndbConnection');
var responceFile = require('../public/javascripts/responceFile');
var sendMail = require('../public/javascripts/maillerFunction');
var sendPush = require('../public/javascripts/pushFunction');
var url = require( "url" );
var queryString = require( "querystring" );


router.post('/empRegistration', function(req, res){
    var userName = req.body.userName;
    var userMobile = req.body.mobile;
    var password = req.body.password;
    var userEmail = (req.body.userEmail)?req.body.userEmail:'';
    var userDevicePlatform = (req.body.devicePlatform)?req.body.devicePlatform:'';
    var userDeviceTocken = (req.body.deviceUUID)?req.body.deviceUUID:'';
    var userAvatar = (req.body.userAvatar)?req.body.userAvatar:'';
    var userStatus = (req.body.userStatus)?req.body.userStatus:'A';
    var mVerified = (req.body.mVerified)?req.body.mVerified:'';
    var fcm_tocken = (req.body.fcmTocken)?req.body.fcmTocken:'';
    responceFile.status = 0;
    responceFile.body = [];
    responceFile.message = '';

    dbConnection.query("select * from usertable where userMobile ='"+userMobile+"'", function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again " + err;
            res.send(responceFile);
        }
        else if(!result.length){
            dbConnection.query("INSERT INTO usertable (userName,userMobile,password,userEmail,userDevicePlatform,userDeviceTocken,userAvatar,userStatus,mVerified,fcm_tocken, userSession) values('"+userName+"','"+userMobile+"','"+password+"','"+userEmail+"','"+userDevicePlatform+"','"+userDeviceTocken+"','"+userAvatar+"','"+userStatus+"','"+mVerified+"','"+fcm_tocken+"', 0)", function (err, result, fields) {
            
                if(err){
                    responceFile.status = 401;
                    responceFile.message = "Database Error, Please try again " + err;
                    res.send(responceFile);

                }else if(result){
                    responceFile.status = 200;
                    responceFile.message = "User has successfully Registered";
                    // var html = "<html>"
                    //     +"<body>"
                    //     +"<p>Dear HR,</p>"
                    //     +"<span> New User <b>"+fullName+" ["+skeinID+"]</b> has registered using SKEIN TRACKER. Please give permission to click this link <a href='http://stracker-app-skein-tracker-application.7e14.starter-us-west-2.openshiftapps.com/updateEmpStatus/?skein_id="+skeinID+"&emp_status=A'>Active</a>"
                    //     +" (OR) You can hold this user to click this link <a href='http://stracker-app-skein-tracker-application.7e14.starter-us-west-2.openshiftapps.com/updateEmpStatus/?skein_id="+skeinID+"&emp_status=HO'>Hold</a> <span>"
                    //     +"<p> Thanks &amp; Regards,<br> SKEIN TRACKER <br> Sponsored by SKEIN TECH</p>"
                    //     +"</body>"
                    //     +"</html>" // html body
                    // sendMail('skeintechtest@gmail.com', 'New Registration', '', html);
                    // sendPush(fcmTocken, 'Registration', 'Your registeration has done successfully, Please wait for HR confirmation', 'Your registeration has done successfully', '', skeinID, 'general');
                    res.send(responceFile);
                }    
            });
          }
        else if(result.length > 0){
            responceFile.status = 401;
            responceFile.message = "This User has already registered in this portal";
            res.send(responceFile);
        }else{
            responceFile.status = 401;
            responceFile.message = "empty";
            res.send(responceFile);
        }
        
    });
});

router.post('/empDetailsUpdate', function(req, res){
    var skeinID = req.body.skein_id;
    var isManager = req.body.ismanager;
    var fullName = req.body.fullname;
    var emailID = req.body.email;
    var mobileNo = req.body.mobile;
    var password = req.body.password;
    var designation = req.body.designation;
    var empOptions = (req.body.empOptions)?1:0;
    responceFile.status = 0;
    responceFile.body = [];
    responceFile.message = '';

    dbConnection.query("UPDATE skeinbook SET fullname='"+fullName+"',email='"+emailID+"',mobile='"+mobileNo+"',designation='"+designation+"',emp_option="+empOptions+" where skein_id='"+skeinID+"'", function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
        }else if(result){
            
            responceFile.status = 200;
            responceFile.message = "Your ["+skeinID+"] profile has updated successfully";
            // responceFile.body = result;
            res.send(responceFile);
          }    
    });
});

router.post('/getEmpDetails', function(req, res){
    // var skeinID = req.body.skein_id;
    responceFile.status = 0;
    responceFile.body = [];
    responceFile.message = '';

    dbConnection.query("SELECT skein_id,fullname,photos FROM skeinbook ORDER BY skeinbook.fullname ASC", function (err, result, fields) {
        if (err){
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

router.post('/getEmpDetailsALL', function(req, res){
    var skeinID = req.body.skein_id;
    responceFile.status = 0;
    responceFile.body = [];
    responceFile.message = '';

    var query = (req.body.skein_id)?"SELECT * FROM skeinbook WHERE skein_id='"+req.body.skein_id+"'":"SELECT * FROM skeinbook";

    dbConnection.query(query, function (err, result, fields) {
        if (err){
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

router.post('/updateEmpAvatar', function(req, res){
    var skeinID = req.body.skein_id;
    var photos = req.body.photos;
    responceFile.status = 0;
    responceFile.body = [];
    responceFile.message = '';

    dbConnection.query("UPDATE skeinbook SET photos='"+photos+"' where skein_id='"+skeinID+"'", function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
        }else if(result){
            responceFile.status = 200;
            responceFile.message = "Your [<b>"+skeinID+"</b>] profile picture has updated successfully";
            res.send(responceFile);
          }
        
    });
});

router.post('/getEmpAvatar', function(req, res){

    dbConnection.connect(function(err) {
    var skeinID = req.body.skein_id;
    responceFile.status = 0;
    responceFile.body = [];
    responceFile.message = '';

    dbConnection.query("Select photos from skeinbook where skein_id='"+skeinID+"'", function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            res.send(responceFile);
        }else if(result){
            responceFile.status = 200;
            responceFile.message = "";
            responceFile.body = result;
            res.send(responceFile);
          }
        
    });});
});

router.get('/updateEmpStatus', function(req, res){


    var adr = req.url;
    var q = url.parse(adr, true);
    // console.log("q.search==>>",q.search); //returns '?year=2017&month=february'
    var qdata = q.query; //returns an object: { year: 2017, month: 'february' }
    // console.log("qdata.skein_id==>>", qdata.skein_id); //returns 'february'

    var skeinID = qdata.skein_id;
    var emp_status = qdata.emp_status;
    responceFile.status = 0;
    responceFile.body = [];
    responceFile.message = '';

    dbConnection.query("UPDATE skeinbook SET emp_status='"+emp_status+"' where skein_id='"+skeinID+"'", function (err, result, fields) {
        if (err){
            responceFile.status = 401;
            responceFile.message = "Database Error, Please try again";
            console.log("err===>>>", err);
            res.send(responceFile);
        }else if(result){
            responceFile.status = 200;
            responceFile.message = "Your [<b>"+skeinID+"</b>] profile picture has updated successfully";
            res.send(responceFile);
            console.log("result===>>>", result);
          }
        
    });
});


router.post('/add', function(req, res){
    var newItem = req.body.newItem;
    console.log(newItem);
  });

module.exports = router;