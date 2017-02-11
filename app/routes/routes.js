var clientController  = require('../controllers/clientController'),
    photoController   = require('../controllers/photoController'),
    userController    = require('../controllers/userController'),
    authController    = require('../controllers/authController'),
    express           = require('express'),
    router            = express.Router();

    /***************************************
     *              Register
     ***************************************/
    router.route('/register')
    .post(userController.register)

    /***************************************
     *               Login
     ***************************************/
    router.route('/login')
    .post(userController.login);

    /***************************************
     *          Get All Clients
     ***************************************/
    router.route('/client/all/:userid')
    .get(authController.isAuthenticated, clientController.clientAll);

    /***************************************
     *          Post New Client
     ***************************************/
    router.route('/client/add/:userid')
    .post(authController.isAuthenticated, clientController.clientAdd);

    /***************************************
     *        Get Client Profile
     ***************************************/
    router.route('/client/profile/:userid/:clientid') 
    .get(authController.isAuthenticated, clientController.clientProfile);

    /***************************************
     *            Edit Client
     ***************************************/    
    router.route('/client/edit/:userid/:clientid') 
    .put(authController.isAuthenticated, clientController.clientEdit);

    /***************************************
     *           Delete Client
     ***************************************/ 
    router.route('/client/delete/:userid/:clientid') 
    .delete(authController.isAuthenticated, clientController.clientDelete);

    /***************************************
	 *             Get Photos
	 ***************************************/
    router.route('/photo/:userid/:clientid/:photo') 
    .get(authController.isAuthenticated, photoController.getPhoto);

module.exports = router