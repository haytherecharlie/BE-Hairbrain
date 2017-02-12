// Load required packages
var User = require('../models/userModel');
var photoController = require('./photoController.js');
var configJWT = require('../../config/jwt');
var jwt = require('jsonwebtoken');

/***************************************
 *              Register
 ***************************************/
exports.register = function(req, res) {

  console.log(req.files);

  if (!req.body.email)     { res.status(401).send(); return false; }
  if (!req.body.password)  { res.status(401).send(); return false; }
  if (!req.body.firstname) { res.status(401).send(); return false; }
  if (!req.body.lastname)  { res.status(401).send(); return false; }
  if (!req.body.phone)     { res.status(401).send(); return false; }
  if (!req.body.salon)     { res.status(401).send(); return false; }
  if (!req.files)          { res.status(401).send(); return false; }

  var user = new User({
    email:     req.body.email,
    password:  req.body.password,
    firstname: req.body.firstname,
    lastname:  req.body.lastname,
    phone:     req.body.phone,
    salon:     req.body.salon
  });

  user.save(function(err) {
    if (err) {
      res.send(err);
    } else {
    photoController.saveUserAvatars(req, res, user._id);
    res.json(user);
    }
  });
};

/***************************************
 *               Login
 ***************************************/
exports.login = function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
        
        if (err) { res.status(401).send(); }

        if (!user) { res.status(401).send(); return false; }

    user.verifyPassword( req.body.password, function(err, isMatch) {
        
        if (err) 
          res.status(401).send();

        if (!isMatch)
          res.status(401).send();

        else {
          var myToken = jwt.sign({email: req.body.email, password: req.body.password}, configJWT.secret, {expiresIn : '1d'});
          res.status(200).json({ token: myToken, id: user._id });
        }

      });
  })
}

/***************************************
 *           User Profile
 ***************************************/
exports.profile = function(req, res) {
  // Use the User model to find a specific user
  User.findById(req.params.userid, function(err, user) {
    if (err)
      res.send(err);

    res.json(user);
  });
};

/***************************************
 *        Is the User Logged In
 ***************************************/
exports.isLoggedIn = function(req, res) {
  res.send('authorized');
};