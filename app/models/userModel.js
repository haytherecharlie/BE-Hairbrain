/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
* Author: Charlie Hay
*
* USER MODEL
/******************************************/

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');


/**
 *              UserSchema
 * ----------------------------------------
 *  The User Schema builds the structure, 
 *  in which users are stored in the Mongo
 *  Database. 
 * ----------------------------------------
 */
var UserSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname : {
    type: String,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    required: true
  },
  salon: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    required: true
  },
  totalClients: {
    type: Number,
    required: true
  },
  totalRating: {
    type: Number,
    required: true,
    default: 0
  },
  unreadRatings: {
    type: Number,
    required: true,
    default: 0 
  },
  rawRatings: { 
    type: [{
      date:     { type: Date, default: Date.now },
      stars:    { type: Number },
      comment:  { type: String },
      clientid: { type: String }
    }]
  }

});

// Ensure the Email Address is Unique.
UserSchema.plugin(uniqueValidator);


/**
 *              PreSave
 * ----------------------------------------
 *  Run this method to ensure the user's 
 *  password remains up to date in the DB. 
 * ----------------------------------------
 */
UserSchema.pre('save', function(callback) {

  // Assign this to user. 
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Hash changed password using bcrypt.
  bcrypt.genSalt(5, function(err, salt) {

    // If error send to callback.
    if (err) return callback(err);

    // Hash the password. 
    bcrypt.hash(user.password, salt, null, function(err, hash) {

      // If error send to callback. 
      if (err) return callback(err);

      // Set the password to the hash. 
      user.password = hash;

      // Run the callback. 
      callback();
    })
  })

});


/**
 *              VerifyPassword
 * ----------------------------------------
 *  Compare the password with it's hash to
 *  authenticate User. 
 * ----------------------------------------
 */ 
UserSchema.methods.verifyPassword = function(password, cb) {

  // Compare the passwords. 
  bcrypt.compare(password, this.password, function(err, isMatch) {

    // If error callback error. 
    if (err) return cb(err);

    // Else, callback isMatch. 
    cb(null, isMatch);
  })

};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
