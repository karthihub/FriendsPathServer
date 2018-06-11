var schedule = require('node-schedule');
var mysql = require('mysql');
var dbConnection = require('../../routes/cmndbConnection');
var sendPushnotification = require('./pushFunction');

var j = schedule.scheduleJob('00 20 09 * * *', function(){
    var pushCounts = 0
    dbConnection.query("select * from skeinbook", function (err, result, fields) {
        if (err){
            console.log("DB Error while sending auto PushNotification : ", err);
        } else if(result){

            for(let i=0; i<result.length; i++) {
               var sendPush =  sendPushnotification(result[i].fcm_tocken, "Intimate", "Your Punching time is almost near", "Punching Time", '', result[i].skein_id, "general");
                            pushCounts++;
            }
            console.log("Total Push Notification sent : ", pushCounts);
        }   
    });
  });