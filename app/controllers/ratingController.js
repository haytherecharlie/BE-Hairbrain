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
 *                getRating
 * ----------------------------------------
 *  GET a rating for the user. 
 * ----------------------------------------
 */
exports.getRating = function(req, res) {

  // If userid doesn't exist.
  if (!req.params.userid) { res.status(400).send('There was an error.'); return false; }

  // Find user based on userid
  User.findOne({_id: req.params.userid}, function(err, user) {

    // If user not found send 400
    if(err) { res.status(400).send('User rating not found.'); return false; }

    else {

      // Reset ratings count.
      user.unreadRatings = 0;

      // Create rating object
      var rating = {
        total: user.totalRating,
          raw: user.rawRatings
      }

      // Send 200 and rating object. 
      res.status(200).json(rating); return false;

    }
  })
}


/**
 *                addRating
 * ----------------------------------------
 *  Add a rating to the user's score. 
 * ----------------------------------------
 */
exports.addRating = function(req, res) {

  // If userid doesn't exist.
  if (!req.params.userid) { res.status(400).send('There was an error.'); return false; }

  // If userid doesn't exist.
  if (!req.params.clientid) { res.status(400).send('There was an error.'); return false; }

  // If userid doesn't exist.
  if (!req.body.stars) { res.status(400).send('Rating failed to save.'); return false; }

  // If userid doesn't exist.
  if (!req.body.comment) { res.status(400).send('Rating failed to save.'); return false; }

  // If body id doesn't exist.
  if (!req.body.id) { res.status(400).send('Rating failed to save.'); return false; }

  // Find user based on userid.
  User.findOne({_id: req.params.userid}, function(err, user) {

    // Total rating score.
    var total = 0; 
    
    // Number of ratings. 
    var count = 0;

    // Push ratings to user object.
    user.rawRatings.push({
      stars:    req.body.stars,
      comment:  req.body.comment,
      clientid: req.params.clientid 
    });

    // Increment unread ratings count.
    user.unreadRatings += 1;

    // Count number of total ratings. 
    count = user.rawRatings.length;

    // Summate all user ratings. 
    for (var i = 0; i < count; i++) { total += user.rawRatings[i].stars; }

    // Calculate average User score. 
    user.totalRating = total / count;

    // Save user. 
    user.save(function(err) {

        // If an error exists send it in the response.
        if (err) { res.status(400).send('Rating failed to save.'); return false; }

        // Delete ratings request.
        else { exports.deleteRatingRequest(req, res); }

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
    if (err) { res.status(400).send('New rating request failed to save.'); return false; }

    // Else save the user.
    else {
      
      // Demo phone number used. 
      if (phone === '1 (111) 111-1111') {
        console.log('TRIAL USER TEXT SENT!'); return false;
      } 

      // Twilio Controller called. 
      else {
        twilioController.sendTwilioSMS(phone, name, rating._id);
        console.log('REAL TEXT SENT!'); return false;
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
exports.deleteRatingRequest = function(req, res) {

  // Delete the Client from MongoDB.
  Rating.findByIdAndRemove(req.body.id, function(err) {

    // If an error exists send it in the response.
    if (err) { res.status(400).send('Rating cannot be found.'); return false; }

    // Send 200 if successful.
    else { res.status(200).send('Rating deleted.'); return false; }
    
  })
};

exports.removeRatingForDeletedClient = function(clientid) {

  Rating.findOne({clientid: clientid }, function(err, rating) {

    // If an error exists send it in the response.
    if (err) { console.log(err) }

    var id = rating._id;

    Rating.findByIdAndRemove(id, function(err) {

      // If an error exists send it in the response.
      if (err) { console.log(err) }

    })
  })
};

/**
 *            verifyRatingRequest
 * ----------------------------------------
 *  Removes the request from the database.
 * ----------------------------------------
 */
exports.verifyRatingRequest = function(req, res) {

  Rating.findById(req.params.id, function(err, rating) {

    // If an error exists send 400. 
    if (err) { res.status(400).send('Rating cannot be found.'); return false; }

    // Return the rating object. 
    res.status(200).send(rating);

  })
}
