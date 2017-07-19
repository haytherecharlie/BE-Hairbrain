/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
* Author: Charlie Hay
*
* CLIENT CONTROLLER
/******************************************/

var appRoot          = require('app-root-path');
var Client           = require('../models/clientModel');
var ratingController = require('./ratingController.js');
var userController   = require('./userController.js');


/**
 *                ClientAdd
 * ----------------------------------------
 *  Takes: a request and parses the information
 *  to add a new client to the database. 
 * ----------------------------------------
 */
exports.clientAdd = function(req, res) {

  var client = new Client();

  // If userid doesn't exist. 
  if (!req.params.userid) { res.status(400).send('Error: Userid not found.'); return false; }
  else { client.userid = req.params.userid; }

  // If firstname doesn't exist.
  if (!req.body.firstname) { res.status(400).send('Error: Please include firstname.'); return false; } 
  else { client.firstname = req.body.firstname; }

  // If lastname doesn't exist.
  if (!req.body.lastname) { res.status(400).send('Error: Please include lastname.'); return false; }
  else { client.lastname = req.body.lastname; }

  // If phone doesn't exist.
  if (!req.body.phone) { client.phone = '1(000)000-0000'; }
  else { client.phone = req.body.phone; }

  // If photo doesn't exist.
  if (typeof req.body.photo === 'undefined') { client.photo = 'no-photo'; }
  else { client.photo = req.body.photo; }

  // If avatar doesn't exist.
  if (typeof req.body.avatar === 'undefined') { client.avatar = 'no-avatar'; }
  else { client.avatar = req.body.avatar; }

  // If notes don't exist.
  if (!req.body.notes) { client.notes = ''; }
  else { client.notes = req.body.notes; }  

  // If name doesn't exist.
  if (!req.body.name) { res.status(400).send('Error: No stylist name found.'); return false; }
  else { var name = req.body.name; }

  // Save the client.
  client.save(function(err) {

    // Client save failed.
    if (err) { res.status(400).send('Error: Saving client failed.'); return false; }

    // Client was saved to DB.
    else { 

      // Call ratings controller and create a new request.
      ratingController.newRatingRequest(client.userid, client._id, name, client.phone);

      // Return the client list. 
      userController.appendClientId(res, client.userid, client._id);

    }
  })
};


/**
 *              ClientDelete
 * ----------------------------------------
 *  Removes the client from the database, 
 *  and calls on the photo controller to  
 *  delete their photos directory. 
 * ----------------------------------------
 */
exports.clientDelete = function(req, res) {

  // If userid doesn't exist.
  if (!req.params.userid) { res.status(400).send('There was an error.'); return false; }

  // If userid doesn't exist.
  if (!req.params.clientid) { res.status(400).send('There was an error.'); return false; }
  
  // Assign params to variables. 
  var userid     = req.params.userid;
  var clientid   = req.params.clientid;

  // Delete the Client from MongoDB.
  Client.findByIdAndRemove(clientid, function(err) {

    // If Client can't be found.
    if (err) { res.status(400).send('Client cannot be found.'); return false; }

    // Delete Client's photo folder.
    else { 

      ratingController.removeRatingForDeletedClient(clientid);
      
      userController.removeClientId(res, userid, clientid); 

    }
  })
};


/**
 *                ClientEdit
 * ----------------------------------------
 *  Edit the Client's information or photos. 
 * ----------------------------------------
 */
exports.clientEdit = function(req, res) {

  // If clientid doesn't exist.
  if (!req.params.clientid) { res.status(400).send('Error: There was an error.'); return false; }

  // Use the Client model to find a specific client
  Client.findById(req.params.clientid, function(err, client) {

    // If an error exists send it in the response. 
    if (err) { res.status(400).send('Cannot find ' + client + ' in your clients list.'); return false; }

    else {

      // If userid doesn't exist. 
      if (!req.params.userid) { res.status(400).send('Error: Userid not found.'); return false; }
      else { client.userid = req.params.userid; }

      // If firstname doesn't exist.
      if (!req.body.firstname) { res.status(400).send('Error: Please include firstname.'); return false; } 
      else { client.firstname = req.body.firstname; }

      // If lastname doesn't exist.
      if (!req.body.lastname) { res.status(400).send('Error: Please include lastname.'); return false; }
      else { client.lastname = req.body.lastname; }

      // If phone doesn't exist.
      if (!req.body.phone) { client.phone = '1(000)000-0000'; }
      else { client.phone = req.body.phone; }

      // If photo doesn't exist.
      if (req.body.photo === 'empty') { client.photo = 'no-photo'; }
      else if (req.body.photo === 'unchanged') { /* Photo remains the same */ }
      else { client.photo = req.body.photo; }

      // If avatar doesn't exist.
      if (req.body.avatar === 'empty') { client.avatar = 'no-avatar'; }
      else if (req.body.avatar === 'unchanged') { /* Avatar remains the same */ }
      else { client.avatar = req.body.avatar; }

      // If notes don't exist.
      if (!req.body.notes) { client.notes = ''; }
      else { client.notes = req.body.notes; }  

      // Save the client and check for errors
      client.save(function(err) {

        // If an error exists send it in the response.
        if (err) { res.status(400).send('Error updating client.'); return false; }

        // else return all clients.
        else { 
          exports.returnAllClients(res, client.userid); 
        }

      })
    }
  })
};


/**
 *               ClientProfile
 * ----------------------------------------
 *  Get profile information for a Client, 
 *  this is used when one Client is requested. 
 * ----------------------------------------
 */
exports.clientProfile = function(req, res) {

  // Use the Client model to find a specific client.
  Client.findById(req.params.clientid, function(err, client) {

    // If an error exists send it in the response.
    if (err) { res.status(400).send('Client not found.'); return false; }

    // Send the Client JSON to the Front End. 
    else { res.status(200).json(client); return false; }

  })
};


/**
 *                ClientAll
 * ----------------------------------------
 *  Get all Clients from the database, that
 *  belong to that user. 
 * ----------------------------------------
 */
exports.clientAll = function(req, res) {

  // If userid doesn't exist.
  if (!req.params.userid) { res.status(400).send('There was an error.'); return false; }

  // Assign params to variables. 
  var userid = req.params.userid;

  // Invoke returnAllClients method. 
  exports.returnAllClients(res, userid);

};


/**
 *            ReturnAllClients
 * ----------------------------------------
 *  This is a reusable method that can return
 *  all the clients belonging to a user to 
 *  the front end in an alphabetized manner. 
 * ----------------------------------------
 */
exports.returnAllClients = function(res, userid) {

  // Find the Client based on id. 
  Client.find({ userid: userid },function(err, clients) {

    // If an error exists send it in the response.
    if (err) { res.status(400).send('Cannot retrive clients, please try again.'); return false; }

    else {
      
      // Sort clients alphabetically. 
      clients.sort(function(a, b) {
          var y = a.firstname;
          var z = b.firstname;
          return y.localeCompare(z);
      });
      
      // Send the Clients JSON to the Front End. 
      res.status(200).json(clients); return false;

    }
  })
}
