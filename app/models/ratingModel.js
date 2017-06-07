/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
* Author: Charlie Hay
*
* RATING MODEL
/******************************************/

var mongoose = require('mongoose');

/**
 *              ClientSchema
 * ----------------------------------------
 *  The Client Schema builds the structure, 
 *  in which clients are stored in the Mongo
 *  Database. 
 * ----------------------------------------
 */
var RatingSchema   = new mongoose.Schema({

  userid:   String,
  clientid: String,
  name: 	String

});

// Export the Mongoose model
module.exports = mongoose.model('Rating', RatingSchema);