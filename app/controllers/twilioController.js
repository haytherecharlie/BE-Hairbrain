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
var alphanumericId = "Hairbrain"; // Doesn't work in Canada yet.
var twilioNumber = +14387956366;


 
//require the Twilio module and create a REST client 
var hbTwilio = require('twilio')(accountSid, authToken); 
 
/**
 *               sendTwilioSMS
 * ----------------------------------------
 *  Send SMS using Twilio. 
 * ----------------------------------------
 */
exports.sendTwilioSMS = function(recipientNumber, stylist, ratingid) {

	// Create and send Twillio Message.
	hbTwilio.messages.create({

		// Sender
		from: twilioNumber,

		// Recipeient 
		to:   recipientNumber,

		// Message Body
		body: "Looking good! You just had a hair appointment with " + stylist + 
			". Please take a moment and rate your experience below. " + 
			"https://www.hairbrain.ca/rating/?id=" + ratingid,
			
	})
}
