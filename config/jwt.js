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
    	new RegExp('/user/login'), 
    	new RegExp('/user/register'), 
    	new RegExp('/user/profile.*/', 'i'),
    	new RegExp('/user/avatar.*/', 'i'),
    	new RegExp('/client/avatar.*/', 'i'),
    	new RegExp('/client/photo.*/', 'i'),
    	new RegExp('/rating.*/', 'i')
    ]
};
