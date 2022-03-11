const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');


/** 
 * The route used by the request until the response to the client for the posts
 * @param {String} url - The url used by the request
 * @param {Object} auth - The auth is a middleware and it will authentificate the user using JsonWebToken, it will return the ID {Number} and the Role {Number} of the user
 * @param {Object} multer - Multer is the middleware for the file control and stock 
 * @param {Object} postCtrl - The postCtrl is the controller for each posts
 */
router.post('/forum/create', auth, multer, postCtrl.createPost);
router.get('/forum', postCtrl.readAllPost);
router.get('/forum/reload/post/:id', postCtrl.readOnePost);
router.put('/forum/update/:id', auth, multer, postCtrl.updatePost);
router.delete('/forum/delete/:id', auth, multer, postCtrl.deletePost);

module.exports = router;