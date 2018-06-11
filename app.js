var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.port || 8080;

var app = express();

//set view engin part
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//body parser for json
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//cmnContacts Routes
var routescmnAddTask = require('./routes/cmnContacts');
app.use(routescmnAddTask);

//Authendication Routes
var routescmnAuth = require('./routes/cmnAuth');
app.use(routescmnAuth);

//cmnUserGroup Routes
var routescmnUserGroup = require('./routes/cmnUserGroup');
app.use(routescmnUserGroup);

//Managers Routes
var routescmnMngrRoutes = require('./routes/cmnMngrRoutes');
app.use(routescmnMngrRoutes);

//UserLatLngRequest Routes
var routescmnUserLatLngRequest = require('./routes/cmnUserLatLngRequest');
app.use(routescmnUserLatLngRequest);

//User Details Routes
var routescmnRegistration = require('./routes/cmnRegistration');
app.use(routescmnRegistration);

//Notifications Routes
var routescmnNotifications = require('./routes/cmnNotification');
app.use(routescmnNotifications);

// app.get('*', function(req, res){
//   res.send(405, 'Menthod not allowed');
// })

var autoPushNotification = require('./public/javascripts/autoPushFunction');


app.get('/', function(req, res){
  res.send(200, 'Welcome to Skein-Tracker');
})


app.listen(port, function(){
  console.log('App ready with PORT : ', port);
})

// var server = https.createServer(options, app).listen(port, function(){
//   console.log('App ready with PORT : ', port);
// });