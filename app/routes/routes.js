/*******************************************
* © 2017 Hairbrain inc.
* ---------------------
* Created: February 11th 2017
* Last Modified: March 21st 2017
* Author: Charlie Hay
*
* ROUTES
/******************************************/

var clientController  = require('../controllers/clientController'),
    userController    = require('../controllers/userController'),
    ratingController  = require('../controllers/ratingController'),
    authController    = require('../controllers/authController'),
    express           = require('express'),
    router            = express.Router();


    /*------------------------------------------------------

                        USER API ENDPOINTS

    ------------------------------------------------------*/

    // Register User
    router.route('/user/register')
    .post(userController.register)

    // Login User
    router.route('/user/login')
    .post(userController.login);

    // Check Login Status
    router.route('/user/check')
    .get(userController.isLoggedIn);

    // User Profile
    router.route('/user/profile/:userid')
    .get(userController.userProfile);

    router.route('/user/avatar/:userid')
    .get(userController.userAvatar);


    /*------------------------------------------------------

                       CLIENT API ENDPOINTS

    ------------------------------------------------------*/

    // Get All Clients
    router.route('/client/all/:userid')
    .get(clientController.clientAll);

    // Post New Client
    router.route('/client/add/:userid')
    .post(clientController.clientAdd);

    // Get Client Profile
    router.route('/client/profile/:userid/:clientid') 
    .get(clientController.clientProfile);

    // Delete Client 
    router.route('/client/delete/:userid/:clientid') 
    .delete(clientController.clientDelete);

    // Edit Client   
    router.route('/client/edit/:userid/:clientid') 
    .put(clientController.clientEdit);

    router.route('/client/avatar/:userid/:clientid')
    .get(clientController.clientAvatar);

    router.route('/client/photo/:userid/:clientid')
    .get(clientController.clientPhoto);


    /*------------------------------------------------------

                       RATING API ENDPOINTS

    ------------------------------------------------------*/

    // New User Rating
    router.route('/rating/:userid/:clientid') 
    .post(ratingController.addRating);

    // Verify Rating Request ID
    router.route('/rating/verify/:id')
    .get(ratingController.verifyRatingRequest);

    // Get Stylist Rating
    router.route('/rating/:userid')
    .get(ratingController.getRating);


module.exports = router;
