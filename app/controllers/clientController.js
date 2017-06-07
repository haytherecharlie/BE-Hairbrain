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

  // Create a new instance of the Client model.
  var name         = req.body.name;
  var client       = new Client();
  client.firstname = req.body.firstname;
  client.lastname  = req.body.lastname;
  client.phone     = req.body.phone;
  client.notes     = req.body.notes;
  client.userid    = req.params.userid;

  // Save the client.
  client.save(function(err) {

    // Client wasn't saved. 
    if (err) res.status(401).send();

    ratingController.newRatingRequest(client.userid, client._id, name, client.phone);

    // Files Exist. 
    if (req.files) {

      // Save the photos using the Photo Controller. 
      photoController.savePhoto(req, res, client._id, client.userid);

    } 

    // No Files.
    else {

      // Return Error. No Photo. 
      res.status(401).send();

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
  
  // Assign params to variables. 
  var userid     = req.params.userid;
  var clientid   = req.params.clientid;
  var folderPath = appRoot + '/storage/photos/' + userid + '/' + clientid;

  // Delete the Client's photos. 
  photoController.deleteFolderRecursive(folderPath);

  // Delete the Client from MongoDB.
  Client.findByIdAndRemove(req.params.clientid, function(err) {

    // If an error exists send it in the response.
    if (err) res.status(401).send();

    // Return Clients to the Front End. 
    exports.returnAllClients(res, req.params.userid);

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
    if (err) res.status(401).send();

    // Assign params to variables. 
    client.firstname = req.body.firstname;
    client.lastname  = req.body.lastname;
    client.phone     = req.body.phone;
    client.notes     = req.body.notes;
    client.userid    = req.params.userid;

    // Save the client and check for errors
    client.save(function(err) {

      // If an error exists send it in the response.
      if (err) res.status(401).send();

    // Save any new photos to their directory. 
    photoController.savePhoto(req, res, client._id, client.userid);

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
    if (err) res.status(401).send();

    // Send the Client JSON to the Front End. 
    res.status(200).json(client);

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
    if (err) res.status(401).send();

    // Sort the clients alphabetically. 
    clients.sort(function(a, b) {
        var y = a.firstname;
        var z = b.firstname;
        return y.localeCompare(z);
    });
    
    // Send the Clients JSON to the Front End. 
    res.status(200).json(clients); 

  })

}
