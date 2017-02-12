var clientController  = require('../controllers/clientController'),
    photoController   = require('../controllers/photoController'),
    userController    = require('../controllers/userController'),
    authController    = require('../controllers/authController'),
    express           = require('express'),
    router            = express.Router();

    /***************************************
     *             Register
     ***************************************/
    router.route('/register')
    .post(userController.register)

    /***************************************
     *              Login
     ***************************************/
    router.route('/login')
    .post(userController.login);

    /***************************************
     *            Login Check
     ***************************************/
    router.route('/check')
    .get(userController.isLoggedIn);

    /***************************************
     *           User Profile
     ***************************************/
    router.route('/profile/:userid')
    .get(userController.profile);

    /***************************************
     *          Get All Clients
     ***************************************/
    router.route('/client/all/:userid')
    .get(clientController.clientAll);

    /***************************************
     *          Post New Client
     ***************************************/
    router.route('/client/add/:userid')
    .post(clientController.clientAdd);

    /***************************************
     *        Get Client Profile
     ***************************************/
    router.route('/client/profile/:userid/:clientid') 
    .get(clientController.clientProfile);

    /***************************************
     *            Edit Client
     ***************************************/    
    router.route('/client/edit/:userid/:clientid') 
    .put(clientController.clientEdit);

    /***************************************
     *           Delete Client
     ***************************************/ 
    router.route('/client/delete/:userid/:clientid') 
    .delete(clientController.clientDelete);

    /***************************************
	 *             Get Photos
	 ***************************************/
    router.route('/photo/:userid/:clientid/:photo') 
    .get(photoController.getPhoto);

module.exports = router