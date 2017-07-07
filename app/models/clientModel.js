/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
* Author: Charlie Hay
*
* CLIENT MODEL
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
var ClientSchema   = new mongoose.Schema({

  firstname: String,
  lastname:  String,
  phone:     String,
  notes:     String,
  userid:    String,
  photos:   [String],
  
});


// Export the Mongoose model
module.exports = mongoose.model('Client', ClientSchema);
