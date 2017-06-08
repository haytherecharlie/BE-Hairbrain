/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
* Author: Charlie Hay
*
* PHOTO CONTROLLER
/******************************************/

var fs               = require('fs');
var im               = require('imagemagick');
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
  res.sendFile(appRoot+'/storage/photos/'+userid+'/'+clientid+'/'+photo);

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
  res.sendFile(appRoot+'/storage/photos/'+userid+'/user-avatar/avatar.jpg');
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
exports.savePhoto = function(req, res, clientid, userid) {

  // Create photos path.
  var userFolder   = appRoot +'/storage/photos/' + userid;
  var clientFolder = userFolder + '/' + clientid;

  // Create user folder if necessary.
  if (!fs.existsSync(userFolder))
    fs.mkdirSync(userFolder);

  // Create client folder if necessary. 
  if (!fs.existsSync(clientFolder))
    fs.mkdirSync(clientFolder);

  // Assign params to variables. 
  var photo = req.files.photo;

  // Save photofront. 
  if(photo)
    savePhoto(photo, 'photo', resizeImage);

  // Save the photo as a jpg to folder.
  function savePhoto(photo, name, callback) {

    photo.mv(clientFolder + '/temp-' + name + '.jpg', function(err) {
      
      // If an error exists print it to the console. 
      if(err) res.status(401).send();

    }, callback(name))

  }

  function resizeImage(name) {

    var srcPath    = clientFolder + '/temp-' + name + '.jpg',
        destPath   = clientFolder + '/' + name + '.jpg',
        avatarPath = clientFolder + '/avatar.jpg';

    // If the temp-avatar exists.
    if( fs.existsSync(srcPath) ) {

      easyimg.resize({
        src: srcPath,
        dst: destPath,
        height: 550,
        width: 550
      }).then( function(img) {
        console.log('success');

        easyimg.resize({
          src: srcPath,
          dst: avatarPath,
          height: 160,
          width: 160
        }).then( function(img) {
          fs.unlinkSync(srcPath);
          clientController.returnAllClients(res, userid);
        }, function(err) {
          if (err) res.status(401).send();;
        });

      }, function(err) {
        if (err) res.status(401).send();;
      });


    } else {

      // Wait 1 second and try again.
      setTimeout(function() {
        console.log('trying again.');
        resizeImage(name);
      }, 1000);
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
exports.saveUserAvatar = function(req, res, userid) {

  // Check for files. 
  if (!req.files) res.status(401).send();

  // Assign params to variables. 
  var avatar       = req.files.avatar; 
  var userFolder   = appRoot +'/storage/photos/' + userid;
  var avatarFolder = userFolder + '/user-avatar';

  // Create User folder if needed. 
  if (!fs.existsSync(userFolder))
    fs.mkdirSync(userFolder);

  // Create Avatar folder if needed. 
  if (!fs.existsSync(avatarFolder))
    fs.mkdirSync(avatarFolder);

  // If avatar is set, save it. 
  if(avatar)
    saveUserAvatar(avatar, 'avatar', resizeAvatar());

  // Save User's avatar. 
  function saveUserAvatar(photo, name, callback) {

    photo.mv(avatarFolder + '/temp-' + name + '.jpg', function(err) {    
  
      // If an error exists print it to the console.
      if (err) res.status(401).send();
      
    }, callback);

  }

  // Resize the User Avatar.
  function resizeAvatar() {

      var srcPath  = avatarFolder + '/temp-avatar.jpg';
      var destPath = avatarFolder + '/avatar.jpg';

    // If the temp-avatar exists.
    if(fs.existsSync(srcPath)) {

        easyimg.resize({
          src: srcPath,
          dst: destPath,
          height: 160,
          width: 160
        }).then( function(img) {
          fs.unlinkSync(srcPath);
          res.status(200).send();
        }, function(err) {
          if (err) res.status(401).send();
        });

    } else {

      // Wait 1 second and try again.
      setTimeout(function() {
        resizeAvatar();
      }, 1000);
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

      // Recursive deletions. 
      if(fs.lstatSync(curPath).isDirectory())
        deleteFolderRecursive(curPath);
      else
        fs.unlinkSync(curPath);
    })

    // Remove the directory
    fs.rmdirSync(path);
  }

};