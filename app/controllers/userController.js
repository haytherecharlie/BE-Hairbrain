/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: June 8th 2017
* Author: Charlie Hay
*
* USER CONTROLLER
/******************************************/

var User            = require('../models/userModel');
var photoController = require('./photoController.js');
var configJWT       = require('../../config/jwt');
var jwt             = require('jsonwebtoken');


/**
 *              Register
 * ----------------------------------------
 * Register the user by adding their credentials
 * to the USER Schema in MongoDB, and save profile
 * picture using the photoController.
 *-----------------------------------------
 */
exports.register = function(req, res) {

  // Check that first name exists.
  if (!req.body.firstname) { res.status(400).send('You forgot to include your first name.'); return false; }

  // Check that last name exists.
  if (!req.body.lastname) { res.status(400).send('You forgot to include your last name.'); return false; }

  // Check that phone number exists.
  if (!req.body.phone) { res.status(400).send('You forgot to include your phone number.'); return false; }

  // Check that password exists.
  if (!req.body.password) { res.status(400).send('You forgot to include your password.'); return false; }

  // Check that password is between 8 - 16 characters.
  if (req.body.password.length < 8 || req.body.password.length > 16) { res.status(400).send('Password must be between 8 - 16 characters.'); return false; }

  // Check that email exists.
  if (!req.body.email) { res.status(400).send('You forgot to include your email.'); return false; }

  // Check that salon exists. 
  if (!req.body.salon) { res.status(400).send('You forgot to include your salon'); return false; }

  // Check that avatar exists.
  if (!req.body.avatar) { res.status(400).send('You forgot to include an avatar.'); return false; }

  // Create a new User based on the User Model.
  var user           = new User();
  user.firstname     = req.body.firstname;
  user.lastname      = req.body.lastname;
  user.phone         = req.body.phone;
  user.password      = req.body.password;
  user.email         = req.body.email;
  user.salon         = req.body.salon;
  user.avatar        = req.body.avatar;
  user.accountType   = 'free';
  user.totalClients  = 0;
  user.totalRating   = 0;
  user.unreadRatings = 0;
  user.rawRatings    = [];

  // Save the user to Mongodb.
  user.save(function(err) {

    // If User already exists, send 400. 
    if (err) { res.status(400).send(user.phone + ' is already a registered phone number. Please contact us if you believe this is an error.'); return false; }

    // Else save avatar. 
    else { res.status(200).send('Registration Successful!'); }

  })

}


/**
 *                   Login
 * ----------------------------------------
 * Log the user into the application.
 *-----------------------------------------
 */
exports.login = function(req, res) {

  // Check that phone number exists.
  if (!req.body.phone) { res.status(400).send('Please include a valid phone number'); return false; };

  // Check that password exists.
  if (!req.body.password) { res.status(400).send('You forgot to include your password.'); return false; }

  // Check that password is between 8 - 16 characters.
  if (req.body.password.length < 8 || req.body.password.length > 16) { res.status(400).send('Password must be between 8 - 16 characters.'); return false; }

  // Find the user by their Phone Number.
  User.findOne({phone: req.body.phone}, function(err, user) {
        
    // If there's an error send a 400.
    if (err) { res.status(400).send('There was an error, please try again.'); return false; }

    // If user doesn't exist send a 400.
    if (!user) { res.status(400).send(req.body.phone + ' is not a registered phone number.'); return false; }

    // Verify the password.
    user.verifyPassword( req.body.password, function(err, isMatch) {
        
      // If there's an error send a 400.
      if (err) { res.status(400).send('There was an error, please try again.'); return false; }

      // If the password is wrong send a 400.
      if (!isMatch) { res.status(400).send('Invalid password'); return false; }

      // Else password is a success.
      else {

        // Create a new JWT that lasts for 24 hours. 
        var myToken = jwt.sign({phone: req.body.phone, password: req.body.password}, configJWT.secret, {expiresIn : '1d'});

        // Send 200 status to the Front End. 
        res.status(200).json({ 
          token: myToken, 
          id: user._id, 
          name: user.firstname + ' ' + user.lastname,
          phone: user.phone,
          email: user.email, 
          salon: user.salon,
          avatar: user.avatar
        });
      }
    })
  })
};


/**
 *                   Login
 * ----------------------------------------
 * Log the user into the application.
 *-----------------------------------------
 */
exports.userProfile = function(req, res) {

  console.log(req.params.phone);

  // Find the user by their Phone Number.
  User.findOne({phone: req.params.phone}, function(err, user) {
 
    // If there's an error send a 400.
    if (err) { res.status(400).send('There was an error, please try again.'); return false; }

    // If user doesn't exist send a 400.
    if (!user) { res.status(400).send(req.body.phone + ' is not a registered phone number.'); return false; }

    // Else send the user.
    else { res.status(200).json(user); }

  });
};


/**
 *             IsLoggedIn
 * ----------------------------------------
 * Check if the user is logged in already. 
 *-----------------------------------------
 */
exports.isLoggedIn = function(req, res) {

  // Send 'authorized' to the Front end
  res.status(200).send();

};

