const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');


/** 
 * The route used by the request until the response to the client for the posts
 * @param {String} url - The url used by the request
 * @param {Object} auth - The auth is a middleware and it will authentificate the user using JsonWebToken, it will return the ID {Number} and the Role {Number} of the user
 * @param {Object} multer - Multer is the middleware for the file control and stock 
 * @param {Object} userCtrl - The userCtrl is the controller for each users
 */
router.post('/signup', userCtrl.signup);
router.get('/verify-user', auth, userCtrl.verify);
router.get('/profile/:id', auth, userCtrl.read);
router.post('/login', userCtrl.login);
router.put('/profile/:id', auth, userCtrl.update);
router.put('/profile/password/:id', auth, userCtrl.updatePassword);
router.put('/profile/images/:id', auth, multer, userCtrl.updateProfileImage);
router.delete('/profile/:id', auth, userCtrl.delete);

module.exports = router;