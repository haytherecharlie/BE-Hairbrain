/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
* Author: Charlie Hay
*
* AUTHORIZATION CONTROLLER
/******************************************/


/**
 *              AuthError
 * ----------------------------------------
 * If authorization error occurs, send 
 * a 401 status.
 *-----------------------------------------
 */
exports.authError = function (err, req, res, next) { 

  // If the error is 'UnauthorizedError' send 401. 
  if(err.name === 'UnauthorizedError') res.status(401).send('Your session has expired, please login again.');

};
