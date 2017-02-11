// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var ClientSchema   = new mongoose.Schema({
  first_name: String,
  last_name: String,
  phone: Number,
  email: String,
  notes: String,
  userid: String
});

// Export the Mongoose model
module.exports = mongoose.model('Client', ClientSchema);