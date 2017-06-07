/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
* Author: Charlie Hay
*
* NODE SERVER
/******************************************/

var port             = process.env.PORT || 8080;
var express          = require('express');
var mongoose         = require('mongoose');
var passport         = require('passport');
var fileUpload       = require('express-fileupload');
var bodyParser       = require('body-parser');
var cors             = require('cors'); 
var app              = express();
var morgan           = require('morgan');
var expressJWT       = require('express-jwt');
var configDB         = require('./config/database');
var configCors       = require('./config/cors');
var configJWT		 = require('./config/jwt');
var routes           = require('./app/routes/routes');
var auth			 = require('./app/controllers/authController');

// Connect to the MongoDB
mongoose.connect(configDB.url);

// Set all modules used in app. 
app.use(morgan('dev'));
app.use(fileUpload());
app.use(bodyParser.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(expressJWT({secret: configJWT.secret}).unless({ path: configJWT.except }));
app.use(auth.authError);
app.use(routes);

// Start the Application!
app.listen(port);
console.log('Hairbrain started on port: ' + port);
