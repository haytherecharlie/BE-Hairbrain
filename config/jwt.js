/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
* Author: Charlie Hay
*
* JWT Config
/******************************************/

// Set the secret and unprotected paths. 
module.exports = {
    'secret'   : 'montreal 2030 rue du fort',
    'except'   : [
    	new RegExp('/login'), 
    	new RegExp('/register'), 
    	new RegExp('/photo.*/', 'i'),
    	new RegExp('/rating.*/', 'i')
    ]
};
