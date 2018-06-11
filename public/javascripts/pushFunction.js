var FCM = require('fcm-push');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConnection = require('./../../routes/cmndbConnection');
var responceFile = require('./responceFile');
var date = new Date();

var sendPushnotification = function(dToken, notify_title, notify_content){
    console.log("sample==>>>sendPushnotification");
    var serverKey = 'AAAAreQgzMg:APA91bGOFhBltwgfzL1r31JXDcL-DEHohoez5yE057_pErucyof3Iy5W1MyWNHsSHNyDVN3MtJBgkIPH5Ez46Vq8CvgVYYnEb8PYX6yo_qUKkwP9NiRl-1Q_I9oJOv5VJWLJaTEhwmQ6';
    var fcm = new FCM(serverKey);
    console.log("Tocken==>>"+dToken);
    var message = {
        to: dToken, // required fill with device token or topics
        collapse_key: 'Demo', 
        // data: {
        //     your_custom_data_key: 'your_custom_data_value'
        // },
        notification: {
            title: notify_title,
            body: notify_content
        }
    };
    
    //callback style
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!"+err);
            return err;
        } else if(response){
            console.log("Successfully sent with response: ", response);   
            return response; 
        }
    });
    
    //promise style
    // fcm.send(message)
    //     .then(function(response){
    //         console.log("Successfully sent with response: ", response);
    //     })
    //     .catch(function(err){
    //         console.log("Something has gone wrong!");
    //         console.error(err);
    //     })
}

module.exports = sendPushnotification;
