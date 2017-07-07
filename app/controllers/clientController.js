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
var photoController  = require('./photoController.js');
var ratingController = require('./ratingController.js');


/**
 *                ClientAdd
 * ----------------------------------------
 *  Takes: a request and parses the information
 *  to add a new client to the database. 
 * ----------------------------------------
 */
exports.clientAdd = function(req, res) {

  // If firstname doesn't exist.
  if (!req.body.firstname) { res.status(400).send('Please include firstname.'); return false; }

  // If lastname doesn't exist.
  if (!req.body.lastname) { res.status(400).send('Please include lastname.'); return false; }

  // If phone doesn't exist.
  if (!req.body.phone) { res.status(400).send('Please include phone number.'); return false; }

  // If name doesn't exist.
  if (!req.body.name) { res.status(400).send('There was an error.'); return false; }

  // If userid doesn't exist.
  if (!req.params.userid) { res.status(400).send('There was an error.'); return false; }

  // Assign name variable and create new Client object.
  var name         = req.body.name;
  var client       = new Client();
  client.firstname = req.body.firstname;
  client.lastname  = req.body.lastname;
  client.phone     = req.body.phone;
  client.notes     = req.body.notes;
  client.userid    = req.params.userid;

  // Save the client.
  client.save(function(err) {

    // Client save failed.
    if (err) { res.status(400).send('Error saving client, please try again.'); return false; }

    // Client was saved to DB.
    else { 

      // Call ratings controller and create a new request.
      ratingController.newRatingRequest(client.userid, client._id, name, client.phone);

      // If photo exists send it to photoController.
      if (req.files && req.files.photo) {
        photoController.savePhoto(req.files.photo, res, client._id, client.userid);
      }

      // else return all clients.
      else { 
        exports.returnAllClients(res, userid); 
      }

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
  var folderPath = appRoot + '/storage/photos/' + userid + '/' + clientid;

  // Delete the Client from MongoDB.
  Client.findByIdAndRemove(clientid, function(err) {

    // If Client can't be found.
    if (err) { res.status(400).send('Client cannot be found.'); return false; }

    // Delete Client's photo folder.
    else { photoController.deleteFolderRecursive(folderPath, userid, res); }

  })

};


/**
 *                ClientEdit
 * ----------------------------------------
 *  Edit the Client's information or photos. 
 * ----------------------------------------
 */
exports.clientEdit = function(req, res) {

  // If firstname doesn't exist.
  if (!req.body.firstname) { res.status(400).send('Please include firstname.'); return false; }

  // If lastname doesn't exist.
  if (!req.body.lastname) { res.status(400).send('Please include lastname.'); return false; }

  // If phone doesn't exist.
  if (!req.body.phone) { res.status(400).send('Please include phone number.'); return false; }

  // If notes doesn't exist.
  if (!req.body.notes) { res.status(400).send('Please include notes.'); return false; }

  // If userid doesn't exist.
  if (!req.params.userid) { res.status(400).send('There was an error.'); return false; }

  // If clientid doesn't exist.
  if (!req.params.clientid) { res.status(400).send('There was an error.'); return false; }

  // Use the Client model to find a specific client
  Client.findById(req.params.clientid, function(err, client) {

    // If an error exists send it in the response. 
    if (err) { res.status(400).send('Cannot find ' + client + ' in your clients list.'); return false; }

    else {

      // Assign params to variables. 
      client.firstname = req.body.firstname;
      client.lastname  = req.body.lastname;
      client.phone     = req.body.phone;
      client.notes     = req.body.notes;
      client.userid    = req.params.userid;

      // Save the client and check for errors
      client.save(function(err) {

        // If an error exists send it in the response.
        if (err) { res.status(400).send('Error updating client.'); return false; }

        // If photo exists send it to photoController.
        if (req.files && req.files.photo) {
          photoController.savePhoto(req.files.photo, res, client._id, client.userid);
        }

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
