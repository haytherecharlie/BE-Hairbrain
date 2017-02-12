// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var ClientSchema   = new mongoose.Schema({
  firstname: String,
  lastname: String,
  phone: String,
  email: String,
  notes: String,
  userid: String
});

// Export the Mongoose model
module.exports = mongoose.model('Client', ClientSchema);