/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
* Author: Charlie Hay
*
* PHOTO CONTROLLER
/******************************************/

// Twilio Credentials 
var accountSid = 'AC023f46494d53cb97c763e6429ada94be'; 
var authToken = '662740ab98a3727daf80d5ef7a3707f0'; 
var alphanumericId = "Hairbrain";
var twilioNumber = +14387956366;


 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
exports.sendTwilioSMS = function(recipientNumber, stylist, ratingid) {

	client.messages.create({
	  from: twilioNumber,
	  to:   recipientNumber,
	  body: "Looking good! You just had a hair appointment with " + stylist + 
			". Please take a moment and rate your experience below." + 
			"https://www.hairbrain.ca/rating/?id=" + ratingid,
	})
}