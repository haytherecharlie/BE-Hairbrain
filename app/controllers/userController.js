/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
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
 * to the MongoDB.
 *-----------------------------------------
 */
exports.register = function(req, res) {

  // Check that all necessary information is sent. 
  if (!req.body.email)     { res.status(401).send(); return false; }
  if (!req.body.password)  { res.status(401).send(); return false; }
  if (!req.body.firstname) { res.status(401).send(); return false; }
  if (!req.body.lastname)  { res.status(401).send(); return false; }
  if (!req.body.phone)     { res.status(401).send(); return false; }
  if (!req.body.salon)     { res.status(401).send(); return false; }
  if (!req.files)          { res.status(401).send(); return false; }

  // Create a new User from the User Model.
  var user       = new User()
  user.email     = req.body.email,
  user.password  = req.body.password,
  user.firstname = req.body.firstname,
  user.lastname  = req.body.lastname,
  user.phone     = req.body.phone,
  user.salon     = req.body.salon

  // Save the user and their photos.
  user.save(function(err) {

    // If an error exists send it in the response. 
    if (err) { res.send(err); }

    // Else save the user.
    else {

      // Save the avatar. 
      photoController.saveUserAvatars(req, res, user._id);

      // Return user json to the Front End. 
      res.json(user);
    }
  })

}


/**
 *                   Login
 * ----------------------------------------
 * Log the user into the application.
 *-----------------------------------------
 */
exports.login = function(req, res) {

  // Find the user by their email address.
  User.findOne({email: req.body.email}, function(err, user) {
        
    // If there's an error send a 401.
    if (err) { res.status(401).send(); }

    // If user doesn't exist send a 401.
    if (!user) { res.status(401).send(); return false; }

    // Verify the password.
    user.verifyPassword( req.body.password, function(err, isMatch) {
        
      // If there's an error send a 401.
      if (err) res.status(401).send();

      // If the password is wrong send a 401.
      if (!isMatch) res.status(401).send();

      // Else password is a success.
      else {

        // Create a new JWT that lasts for 24 hours. 
        var myToken = jwt.sign({email: req.body.email, password: req.body.password}, configJWT.secret, {expiresIn : '1d'});

        // Send the token to the Front End. 
        res.status(200).json({ 
          token: myToken, 
          id: user._id, 
          name: user.firstname + ' ' + user.lastname,
          phone: user.phone,
          email: user.email, 
          salon: user.salon 
        });
      }
    })
  })

};


/**
 *                Profile
 * ----------------------------------------
 * Get the user's profile information. 
 *-----------------------------------------
 */
exports.profile = function(req, res) {

  // Use the User model to find a specific user
  User.findById(req.params.userid, function(err, user) {
    
    // If there is an error, send the error. 
    if (err)res.send(err);

    // Send the user JSON to the Front End.
    res.json(user);
  })

};

/**
 *             IsLoggedIn
 * ----------------------------------------
 * Check if the user is logged in already. 
 *-----------------------------------------
 */
exports.isLoggedIn = function(req, res) {

  // Send 'authorized' to the Front end
  res.send('authorized');

};
