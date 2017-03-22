/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
* Author: Charlie Hay
*
* PHOTO CONTROLLER
/******************************************/

var fs      = require('fs');
var appRoot = require('app-root-path');

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
 *               SavePhotos
 * ----------------------------------------
 *  Takes: userid, clientid, and req as
 *  arguments, checks for files in req, 
 *  creates subdirectories if needed, then
 *  saves the photos in the users folder. 
 * ----------------------------------------
 */
exports.savePhotos = function(req, res, clientid, userid) {

  // Create photos path.
  var userFolder = appRoot +'/storage/photos/' + userid;
  var clientFolder = userFolder + '/' + clientid + '/';

  // Check for files. 
  if (!req.files) return;

  // Create user folder if necessary.
  if (!fs.existsSync(userFolder))
    fs.mkdirSync(userFolder);

  // Create client folder if necessary. 
  if (!fs.existsSync(clientFolder))
    fs.mkdirSync(clientFolder);

  // Assign params to variables. 
  var photofront = req.files.photofront, 
      photoleft  = req.files.photoleft, 
      photoright = req.files.photoright, 
      photoback  = req.files.photoback;

  // Save photofront. 
  if(photofront)
    savePhoto(photofront, 'photofront');

  // Save photoleft.
  if(photoleft)
    savePhoto(photoleft, 'photoleft');

  // Save photoright.
  if (photoright)
    savePhoto(photoright, 'photoright');

  // Save photoback. 
  if (photoback)
    savePhoto(photoback, 'photoback');

  // Save the photo as a jpg to folder.
  function savePhoto(photo, name) {
    photo.mv(clientFolder + '/' + name + '.jpg', function(err) {
      
      // If an error exists print it to the console. 
      if(err) 
        console.error(err);
    })
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
exports.saveUserAvatars = function(req, res, userid) {

  // Check for files. 
  if (!req.files) return;

  // Assign params to variables. 
  var avatar = req.files.avatar; 
  var userFolder   = appRoot +'/storage/photos/' + userid;
  var avatarFolder = userFolder + '/avatar';

  // Create User folder if needed. 
  if (!fs.existsSync(userFolder))
    fs.mkdirSync(userFolder);

  // Create Avatar folder if needed. 
  if (!fs.existsSync(avatarFolder))
    fs.mkdirSync(avatarFolder);

  // If avatar is set, save it. 
  if(avatar)
    saveUserAvatar(avatar, 'avatar');

  // Save User's avatar. 
  function saveUserAvatar(photo, name) {
    photo.mv(avatarFolder + '/' + name + '.jpg', function(err) {
        
      // If an error exists print it to the console.
      if (err) 
        console.error(err);
      
    })
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
