var fs = require('fs');
var appRoot = require('app-root-path');

/***************************************
 *             Get Photo
 ***************************************/
exports.getPhoto = function(req, res) {
    var userid      = req.params.userid;
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

  var photofront = req.files.photofront, 
      photoleft = req.files.photoleft, 
      photoright = req.files.photoright, 
      photoback = req.files.photoback;

  if(photofront)
    savePhoto(photofront, 'photofront');
  if(photoleft)
    savePhoto(photoleft, 'photoleft');
  if (photoright)
    savePhoto(photoright, 'photoright');
  if (photoback)
    savePhoto(photoback, 'photoback');

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
