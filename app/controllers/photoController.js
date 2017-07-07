/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: June 8th 2017
* Author: Charlie Hay
*
* PHOTO CONTROLLER
/******************************************/

var fs               = require('fs');
var easyimg          = require('easyimage');
var appRoot          = require('app-root-path');
var clientController = require('./clientController.js');


/**
 *                GetPhoto
 * ----------------------------------------
 *  Takes: userid, clientid, and photoid as 
 *  URI parameters, and sends the photo from
 *  the backend as a response. 
 * ----------------------------------------
 */
exports.getPhoto = function(req, res) {

  // Assign params to variables. 
  var userid    = req.params.userid;
  var clientid  = req.params.clientid;
  var photo     = req.params.photo;

  // Send the image based on the path. 
  res.sendFile(appRoot+'/storage/photos/'+userid+'/'+clientid+'/'+photo, 
    function(err) { if (err) { res.sendFile(appRoot+'/storage/default/client.jpg'); }
  });
};


/**
 *                GetAvatar
 * ----------------------------------------
 *  Takes: userid and photoid as params and 
 *  returns the profile picture. 
 * ----------------------------------------
 */
exports.getAvatar = function(req, res) {

  // Assign params to variables. 
  var userid    = req.params.userid;

  // Send the image based on the path. 
  res.sendFile(appRoot+'/storage/photos/'+userid+'/avatar/avatar.jpg', 

    // If image failed to load, send default image. 
    function(err) { if(err) { res.sendFile(appRoot+'/storage/default/avatar.jpg'); }

  });
};


/**
 *               SavePhoto
 * ----------------------------------------
 *  Takes: userid, clientid, and req as
 *  arguments, checks for files in req, 
 *  creates subdirectories if needed, then
 *  saves the photos in the users folder. 
 * ----------------------------------------
 */
exports.savePhoto = function(photo, res, clientid, userid) {

  // Assign User folder path.
  var userFolder   = appRoot +'/storage/photos/' + userid;

  // Assign Client folder path. 
  var clientFolder = userFolder + '/' + clientid;

  // Set source photo path.
  var photoPath  = clientFolder + '/photo.jpg';

  // Set avatar path. 
  var avatarPath = clientFolder + '/avatar.jpg';  

  // Create User folder if necessary.
  if (!fs.existsSync(userFolder)) { fs.mkdirSync(userFolder); }

  // Create Client folder if necessary. 
  if (!fs.existsSync(clientFolder)) { fs.mkdirSync(clientFolder); }

  // If a photo exists already, delete.
  if (fs.existsSync(photoPath)) { fs.unlinkSync(photoPath); }

  // If a avatar exists already, delete.
  if (fs.existsSync(avatarPath)) { fs.unlinkSync(avatarPath); }

  // Create temporary photo. 
  photo.mv(photoPath, function(err) {
    
    // If an error exists print it to the console. 
    if(err) { res.status(400).send('Error saving client photo, please try again.'); return false; }

    // If an avatar doesn't exist yet. 
    if (!fs.existsSync(avatarPath)) { 

      // Resize client avatar.
      easyimg.resize({
        src: photoPath,
        dst: avatarPath,
        height: 150,
        width: 150 
      })

      // Return all clients.
      .then( function() { clientController.returnAllClients(res, userid);}, 

      // If error saving avatar. 
      function(err) {

        // Send 400 error. 
        if (err) { res.status(400).send('Error resizing client avatar.'); return false; }

      });
    }
  }); 
};


/**
 *             SaveUserAvatar
 * ----------------------------------------
 *  Takes: userid and a photo file, and saves
 *  the photo as the User's avatar for their
 *  profile. 
 * ----------------------------------------
 */
exports.saveUserAvatar = function(avatar, res, userid) {

  // Assign variables. 
  var userFolder   = appRoot +'/storage/photos/' + userid;
  var avatarFolder = userFolder + '/avatar/';

  // Create User folder if needed. 
  if (!fs.existsSync(userFolder)) { fs.mkdirSync(userFolder); }

  // Create Avatar folder if needed. 
  if (!fs.existsSync(avatarFolder)) { fs.mkdirSync(avatarFolder); }

  // Move the avatar to a temp folder then call resize function.
  avatar.mv(avatarFolder + 'avatar.jpg', function(err) {    

    // If an error exists send 400 and message.
    if (err) { res.status(400).send('Error uploading profile picture, please try again.'); return false; }

    else { res.status(200).send('Registration Successful!') };
    
  });

};


/**
 *           DeleteFolderRecursive
 * ----------------------------------------
 *  When a user is deleted, we also delete 
 *  their photos and their parent directories, 
 *  this function removes them recursivly. 
 * ----------------------------------------
 */
exports.deleteFolderRecursive = function(path, userid, res) {

  // Check if the path exists.  
  if(fs.existsSync(path)) {

    // Loop through directories in the path. 
    fs.readdirSync(path).forEach(function(file,index){

      // Assign path to file to variable. 
      var curPath = path + "/" + file;

      // Recursive delete folder.  
      if(fs.lstatSync(curPath).isDirectory()) { deleteFolderRecursive(curPath); }

      // Unlink folder path. 
      else { fs.unlinkSync(curPath); }

    })

    // Remove the directory
    fs.rmdirSync(path);
  }

  // Return Clients to the Front End. 
  clientController.returnAllClients(res, userid);

};
