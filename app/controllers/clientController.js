/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
* Author: Charlie Hay
*
* CLIENT CONTROLLER
/******************************************/

var Client          = require('../models/clientModel');
var photoController = require('./photoController.js');
var appRoot         = require('app-root-path');

/**
 *                ClientAdd
 * ----------------------------------------
 *  Takes: a request and parses the information
 *  to add a new client to the database. 
 * ----------------------------------------
 */
exports.clientAdd = function(req, res) {

  // Create a new instance of the Client model.
  var client       = new Client();
  client.firstname = req.body.firstname;
  client.lastname  = req.body.lastname;
  client.phone     = req.body.phone;
  client.notes     = req.body.notes;
  client.userid    = req.params.userid;

  // Save the photos using the Photo Controller. 
  photoController.savePhotos(req, res, client._id, client.userid);

  // Save the client.
  client.save(function(err) {

    // If an error exists send it in the response. 
    if (err) res.send(err);

    // Return the clients to the Front End. 
    returnAllClients(res, req.params.userid);
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
  
  // Assign params to variables. 
  var userid     = req.params.userid;
  var clientid   = req.params.clientid;
  var folderPath = appRoot + '/storage/photos/' + userid + '/' + clientid;

  // Delete the Client's photos. 
  photoController.deleteFolderRecursive(folderPath);

  // Delete the Client from MongoDB.
  Client.findByIdAndRemove(req.params.clientid, function(err) {

    // If an error exists send it in the response.
    if (err)
      res.send(err);

    // Return Clients to the Front End. 
    returnAllClients(res, req.params.userid);
  })

};


/**
 *                ClientEdit
 * ----------------------------------------
 *  Edit the Client's information or photos. 
 * ----------------------------------------
 */
exports.clientEdit = function(req, res) {

  // Use the Client model to find a specific client
  Client.findById(req.params.clientid, function(err, client) {

    // If an error exists send it in the response. 
    if (err) res.send(err);

    // Save any new photos to their directory. 
    photoController.savePhotos(req, res, client._id, client.userid);

    // Assign params to variables. 
    client.firstname = req.body.firstname;
    client.lastname  = req.body.lastname;
    client.phone     = req.body.phone;
    client.notes     = req.body.notes;
    client.userid    = req.params.userid;

    // Save the client and check for errors
    client.save(function(err) {

      // If an error exists send it in the response.
      if (err) res.send(err);

      // Return Clients to the Front End.
      returnAllClients(res, req.params.userid);
    })
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
    if (err)res.send(err);

    // Send the Client JSON to the Front End. 
    res.json(client);
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

  // Assign params to variables. 
  var userid = req.params.userid;

  // Invoke returnAllClients method. 
  returnAllClients(res, userid);

};


/**
 *            ReturnAllClients
 * ----------------------------------------
 *  This is a reusable method that can return
 *  all the clients belonging to a user to 
 *  the front end in an alphabetized manner. 
 * ----------------------------------------
 */
function returnAllClients(res, userid) {

  // Find the Client based on id. 
  Client.find({ userid: userid },function(err, clients) {

    // If an error exists send it in the response.
    if (err) res.send(err);

    // Sort the clients alphabetically. 
    clients.sort(function(a, b) {
        var y = a.firstname;
        var z = b.firstname;
        return y.localeCompare(z);
    });
    
    // Send the Clients JSON to the Front End. 
    res.json(clients); 
  })

}
