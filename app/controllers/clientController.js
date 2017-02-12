// Load required packages
var Client = require('../models/clientModel');
var photoController = require('./photoController.js');
var appRoot = require('app-root-path');

/***************************************
 *            Add Client
 ***************************************/
exports.clientAdd = function(req, res) {

  // Create a new instance of the Client model
  var client = new Client();
  client.firstname    = req.body.firstname;
  client.lastname     = req.body.lastname;
  client.phone        = req.body.phone;
  client.email        = req.body.email;
  client.notes        = req.body.notes;
  client.userid       = req.params.userid;

  photoController.savePhotos(req, res, client._id, client.userid);

  // Save the client and check for errors
  client.save(function(err) {
    if (err)
      res.send(err);

      returnAllClients(res, req.params.userid);
  });
};


/***************************************
 *            Delete Client
 ***************************************/
exports.clientDelete = function(req, res) {
  
  var folderPath = appRoot + '/storage/photos/' + req.params.userid + '/' + req.params.clientid;
  photoController.deleteFolderRecursive(folderPath);

  Client.findByIdAndRemove(req.params.clientid, function(err) {
    if (err)
      res.send(err);

      returnAllClients(res, req.params.userid);
  });
};

/***************************************
 *             Edit Client
 ***************************************/
exports.clientEdit = function(req, res) {
  // Use the Client model to find a specific client
  Client.findById(req.params.clientid, function(err, client) {
    if (err)
      res.send(err);

      photoController.savePhotos(req, res, client._id, client.userid);

      client.firstname   = req.body.firstname;
      client.lastname    = req.body.lastname;
      client.phone        = req.body.phone;
      client.email        = req.body.email;
      client.notes        = req.body.notes;
      client.userid         = req.params.userid;

    // Save the client and check for errors
    client.save(function(err) {
      if (err)
        res.send(err);

        returnAllClients(res, req.params.userid);
    });
  });
};

/***************************************
 *           Client Profile
 ***************************************/
exports.clientProfile = function(req, res) {
  // Use the Client model to find a specific client
  Client.findById(req.params.clientid, function(err, client) {
    if (err)
      res.send(err);

    res.json(client);
  });
};

/***************************************
 *             Client All
 ***************************************/
exports.clientAll = function(req, res) {
  var userid = req.params.userid;
  returnAllClients(res, userid);
};

/***************************************
 *       Return All Clients Helper
 ***************************************/
function returnAllClients(res, userid) {
  Client.find({ userid: userid },function(err, clients) {
    if (err) res.send(err);
    
    res.json(clients);; 
  });
}
