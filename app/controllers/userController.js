/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: June 8th 2017
* Author: Charlie Hay
*
* USER CONTROLLER
/******************************************/

var appRoot          = require('app-root-path');
var User             = require('../models/userModel');
var configJWT        = require('../../config/jwt');
var jwt              = require('jsonwebtoken');
var clientController = require('./clientController.js');


/**
 *              Register
 * ----------------------------------------
 * Register the user by adding their credentials
 * to the USER Schema in MongoDB, and save profile
 * picture using the photoController.
 *-----------------------------------------
 */
exports.register = function(req, res) {

  // Create a new User based on the User Model.
  var user = new User();

  // Check that first name exists.
  if (!req.body.firstname) { res.status(400).send('You forgot to include your first name.'); return false; }
  else { user.firstname = req.body.firstname; }

  // Check that last name exists.
  if (!req.body.lastname) { res.status(400).send('You forgot to include your last name.'); return false; }
  else { user.lastname = req.body.lastname; }

  // Check that phone number exists.
  if (!req.body.phone) { res.status(400).send('You forgot to include your phone number.'); return false; }
  else { user.phone = req.body.phone; }

  // Check that password exists.
  if (!req.body.password) { res.status(400).send('You forgot to include your password.'); return false; }

  // Check that password is between 8 - 16 characters.
  if (req.body.password.length < 8 || req.body.password.length > 16) { res.status(400).send('Password must be between 8 - 16 characters.'); return false; }
  else { user.password = req.body.password; }

  // Check that email exists.
  if (!req.body.email) { res.status(400).send('You forgot to include your email.'); return false; }
  else { user.email = req.body.email; }

  // Check that salon exists. 
  if (!req.body.salon) { res.status(400).send('You forgot to include your salon'); return false; }
  else { user.salon = req.body.salon; }

  if(!req.body.keyword) { res.status(400).send('You forgot to include the beta keyword'); return false; }
  if(req.body.keyword !== 'hairbeta') { res.status(400).send('Incorrect beta keyword'); return false; }

  // Check that avatar exists.
  if (!req.body.avatar) { res.status(400).send('You forgot to include an avatar.'); return false; }
  if (req.body.avatar === 'undefined') { user.avatar = 'no-avatar'; }
  else { user.avatar = req.body.avatar; }

  user.clients       = [],
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
          name: user.firstname+' '+ user.lastname
        });
      }
    })
  })
};

exports.appendClientId = function(res, userid, clientid) {

  User.findById(userid, function(err, user) {

    // If there's an error send a 400.
    if (err) { res.status(400).send('There was an error, please try again.'); return false; }   

    user.clients.push(clientid);

    user.totalClients += 1;

    // Save the client and check for errors
    user.save(function(err) {

      // If an error exists send it in the response.
      if (err) { res.status(400).send('Error updating user.'); return false; }

      // else return all clients.
      else { clientController.returnAllClients(res, userid); return false; }

    })

  })
};

exports.removeClientId = function(res, userid, clientid) {

  User.findById(userid, function(err, user) {

    // If there's an error send a 400.
    if (err) { res.status(400).send('There was an error, please try again.'); return false; } 

    for(var i in user.clients) {

      if(user.clients[i] === clientid) {

        user.clients.splice(i, 1);
        user.totalClients -= 1;

        // Save the client and check for errors
        user.save(function(err) {

          // If an error exists send it in the response.
          if (err) { res.status(400).send('Error updating user.'); return false; }

          // else return all clients.
          else { clientController.returnAllClients(res, userid); return false; }

        })
      }
    }

  })
};


/**
 *              User Profile
 * ----------------------------------------
 * Get the user profile.
 *-----------------------------------------
 */
exports.userProfile = function(req, res) {

  // Find the user by their Phone Number.
  User.findById(req.params.userid, function(err, user) {
 
    // If there's an error send a 400.
    if (err) { res.status(400).send('There was an error, please try again.'); return false; }

    // If user doesn't exist send a 400.
    if (!user) { res.status(400).send('Error: User not found'); return false; }

    // Else send the user.
    else { res.status(200).json({
        phone: user.phone,
        email: user.email, 
        salon: user.salon,
        avatar: user.avatar
      }); 
    }

  });
};


/**
 *              User Avatar
 * ----------------------------------------
 * Get the user profile.
 *-----------------------------------------
 */
exports.userAvatar = function(req, res) {

  // Find the user by their Phone Number.
  User.findById(req.params.userid, function(err, user) {
 
    // If there's an error send a 400.
    if (err) { res.status(400).send('There was an error, please try again.'); return false; }

    // If user doesn't exist send a 400.
    if (!user) { res.status(400).send('Error: User not found'); return false; }

    // Else send the user.
    else { 

      if(user.avatar === 'no-avatar') {
        res.status(200).sendFile(appRoot+'/storage/default_images/defaultavatar.png');
        return false;
      }

      else {

        var img = new Buffer(user.avatar.split(',')[1], 'base64');

        res.writeHead(200, {
           'Content-Type': 'image/jpeg',
           'Content-Length': img.length
        });

        res.end(img);

      }
    }
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

