var fs = require('fs');
var appRoot = require('app-root-path');

/***************************************
 *             Get Photo
 ***************************************/
exports.getPhoto = function(req, res) {
    var userid        = req.params.userid;
    var clientid    = req.params.clientid;
    var photo       = req.params.photo
    res.sendFile(appRoot+'/storage/photos/'+userid+'/'+clientid+'/'+photo);
}

/***************************************
 *            Save Images
 ***************************************/
exports.savePhotos = function(req, res, clientid, userid) {
  var userFolder = appRoot +'/storage/photos/' + userid;
  var clientFolder = userFolder + '/' + clientid + '/';

  if (!req.files) return;

  if (!fs.existsSync(userFolder))
    fs.mkdirSync(userFolder);
  if (!fs.existsSync(clientFolder))
      fs.mkdirSync(clientFolder);

  var photo_front = req.files.photo_front, 
      photo_left = req.files.photo_left, 
      photo_right = req.files.photo_right, 
      photo_back = req.files.photo_back;

  if(photo_front)
    savePhoto(photo_front, 'photo_front');
  if(photo_left)
    savePhoto(photo_left, 'photo_left');
  if (photo_right)
    savePhoto(photo_right, 'photo_right');
  if (photo_back)
    savePhoto(photo_back, 'photo_back');

  function savePhoto(meow, name) {
    meow.mv(clientFolder + '/' + name + '.jpg', function(err) {
        if (err) console.error(err);
    });
  }
}

/***************************************
 *           Save User Avatar
 ***************************************/
exports.saveUserAvatars = function(req, res, userid) {

  if (!req.files) return;

  var userFolder = appRoot +'/storage/photos/' + userid;
  var avatarFolder = userFolder + '/avatar';

  if (!fs.existsSync(userFolder))
    fs.mkdirSync(userFolder);
  if (!fs.existsSync(avatarFolder))
    fs.mkdirSync(avatarFolder);

  var avatar = req.files.avatar;

  if(avatar)
    saveUserAvatar(avatar, 'avatar');

  function saveUserAvatar(meow, name) {
    meow.mv(avatarFolder + '/' + name + '.jpg', function(err) {
        if (err) console.error(err);
    });
  }
}


/***************************************
 *            Delete Photos
 ***************************************/
exports.deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
