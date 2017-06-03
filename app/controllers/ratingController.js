/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
* Author: Charlie Hay
*
* RATING CONTROLLER
/******************************************/

var Rating           = require('../models/ratingModel');
var User             = require('../models/userModel');
var twilioController = require('../controllers/twilioController');

/**
 *                addRating
 * ----------------------------------------
 *  Add a rating to the user's score. 
 * ----------------------------------------
 */
exports.addRating = function(req, res) {

  User.findOne({_id: req.params.userid}, function(err, user) {

    var total = 0, count = 0;

    user.rawRatings.push({
      stars:    req.body.stars,
      comment:  req.body.comment,
      clientid: req.params.clientid 
    });

    user.unreadRatings += 1;

    count = user.rawRatings.length;

    for( var i = 0; i < count; i++ ) {
      total += user.rawRatings[i].stars;
    }

    user.totalRating = total / count;

    user.save(function(err) {

        // If an error exists send it in the response.
        if (err) res.send(err);

        exports.deleteRatingRequest(req.body.id);

        // Send user as a response !!! CHANGE THIS!
        res.json(user);
    })

  });

}


/**
 *             newRatingRequest
 * ----------------------------------------
 *  Request a rating from the client. 
 * ----------------------------------------
 */
exports.newRatingRequest = function(userid, clientid, name, phone) {

  // New Ratings Object
  var rating      = new Rating();
  rating.userid   = userid;
  rating.clientid = clientid;
  rating.name     = name;
  rating.phone    = phone;

  // Save the user and their photos.
  rating.save(function(err) {

    // If an error exists send it in the response. 
    if (err) { 

      // Return error.
      return err; 

    }

    // Else save the user.
    else {
      
      // Trial Account
      if(userid === '59307f72c4543625d7b13187' && phone === '1 (519) 657-9849'){
        console.log('TRIAL USER TEXT SENT!')
        return rating;
      } else {
        twilioController.sendTwilioSMS(phone, name, rating._id);
        console.log('REAL TEXT SENT!')
        return rating;
      }
    }

  })

}


/**
 *            deleteRatingRequest
 * ----------------------------------------
 *  Removes the request from the database.
 * ----------------------------------------
 */
exports.deleteRatingRequest = function(id) {

  // Delete the Client from MongoDB.
  Rating.findByIdAndRemove(id, function(err) {

    // If an error exists send it in the response.
    if (err) return err;

    // Send 200 if successful.
    return false;

  })

}


/**
 *            verifyRatingRequest
 * ----------------------------------------
 *  Removes the request from the database.
 * ----------------------------------------
 */
exports.verifyRatingRequest = function(req, res) {

  Rating.findById(req.params.id, function(err, rating) {

    // If an error exists send it in the response. 
    if (err) res.send(404);

    // Return the rating object. 
    res.send(rating);

  })

}
