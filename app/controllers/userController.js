// Load required packages
var User = require('../models/userModel');
var photoController = require('./photoController.js');
var jwt = require('jsonwebtoken');

/***************************************
 *              Register
 ***************************************/
exports.register = function(req, res) {

  if (!req.body.email)    { res.status(401).send(); return false; }
  if (!req.body.password) { res.status(401).send(); return false; }
  if (!req.body.phone)    { res.status(401).send(); return false; }
  if (!req.body.salon)    { res.status(401).send(); return false; }
  if (!req.body.rating)   { res.status(401).send(); return false; }

  var user = new User({
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    salon: req.body.salon,
    rating: req.body.rating
  });

  user.save(function(err) {
    if (err) {
      res.send(err);
    } else {
    photoController.saveUserAvatars(req, res, user._id);
    res.json({ message: 'New user added to the database!' });
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
          var myToken = jwt.sign({email: req.body.email}, 'montreal 2030 rue du fort', {expiresIn : '1d'});
          res.status(200).json({ token: myToken, id: user._id });
        }

      });
  })
}

/***************************************
 *           User Profile
 ***************************************/
exports.getUser = function(req, res) {
  // Use the User model to find a specific user
  User.findById(req.params.user_id, function(err, user) {
    if (err)
      res.send(err);

    res.json(user);
  });
};