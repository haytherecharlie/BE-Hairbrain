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
  res.sendFile(appRoot+'/storage/photos/'+userid+'/user-avatar/avatar.jpg', 

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

  // Create User folder if necessary.
  if (!fs.existsSync(userFolder)) { fs.mkdirSync(userFolder); }

  // Create Client folder if necessary. 
  if (!fs.existsSync(clientFolder)) { fs.mkdirSync(clientFolder); }

  // Create temporary photo. 
  photo.mv(clientFolder + '/temp-photo.jpg', function(err) {
    
    // If an error exists print it to the console. 
    if(err) res.status(400).send('Error saving client photo, please try again.');

  }, resizeImage())

  // Resize the Image.
  function resizeImage(name) {

    var srcPath    = clientFolder + '/temp-photo.jpg',
        destPath   = clientFolder + '/photo.jpg',
        avatarPath = clientFolder + '/avatar.jpg';

    // If temp-photo.jpg exists.
    if( fs.existsSync(srcPath) ) {

      // Resize client image. 
      easyimg.resize({
        src: srcPath,
        dst: destPath,
        height: 550,
        width: 550
      }).then( function(img) {

        // Resize client avatar.
        easyimg.resize({
          src: srcPath,
          dst: avatarPath,
          height: 160,
          width: 160 
        })

        // Unlink the temp-photo.jpg file and return all clients. 
        .then( function(img) {
          fs.unlinkSync(srcPath);
          clientController.returnAllClients(res, userid);
        }, 

        // If error saving avatar. 
        function(err) {

          // Send 400 error. 
          if (err) res.status(400).send('Error resizing client avatar.');

        });
      }, 

      // If error saving client photo.
      function(err) {

        // Send 400 error.
        if (err) res.status(400).send('Error resizing client avatar.');

      });
    } 

    // If temp-photo.jpg doesn't exist.
    else {

      // Wait 1 second and try again.
      setTimeout(function() { resizeImage(name); }, 1000);

    }
  }      
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
  var avatarFolder = userFolder + '/user-avatar';

  // Create User folder if needed. 
  if (!fs.existsSync(userFolder)) { fs.mkdirSync(userFolder); }

  // Create Avatar folder if needed. 
  if (!fs.existsSync(avatarFolder)) { fs.mkdirSync(avatarFolder); }

  // Move the avatar to a temp folder then call resize function.
  avatar.mv(avatarFolder+'/temp-avatar.jpg', function(err) {    

    // If an error exists send 400 and message.
    if (err) { res.status(400).send('Error uploading profile picture, please try again.'); }
    
  }, resizeAvatar());

  // Resize the User Avatar.
  function resizeAvatar() {

    // Set source path.
    var srcPath  = avatarFolder + '/temp-avatar.jpg';

    // Set destination path. 
    var destPath = avatarFolder + '/avatar.jpg';

    // If the temp-avatar exists.
    if(fs.existsSync(srcPath)) {

        easyimg.resize({
          src: srcPath,
          dst: destPath,
          height: 200,
          width: 200
        }).then( function(img) {
          fs.unlinkSync(srcPath);
          res.status(200).send('User successfully registered.');
        }, function(err) {
          if (err) { res.status(400).send('Error uploading profile picture, please try again.'); }
        });

    } else {

      // Wait 1 second and try again.
      setTimeout(function() { resizeAvatar(); }, 1000);

    }
  }

};


/**
 *           DeleteFolderRecursive
 * ----------------------------------------
 *  When a user is deleted, we also delete 
 *  their photos and their parent directories, 
 *  this function removes them recursivly. 
 * ----------------------------------------
 */
exports.deleteFolderRecursive = function(path) {

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
};
