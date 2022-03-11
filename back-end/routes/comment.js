const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');
const auth = require('../middlewares/auth');

/** 
 * The route used by the request until the response to the client for the comments
 * @param {String} url - The url used by the request
 * @param {Object} auth - The auth is a middleware and it will authentificate the user using JsonWebToken, it will return the ID and the Role of the user
 * @param {Object} commentCtrl - The commentCtrl is the controller for each comments
 */
router.post('/forum/comment/create/:id', auth, commentCtrl.createComment);
router.get('/forum/comment/:id', commentCtrl.readComment);
router.put('/forum/comment/update/:id', auth, commentCtrl.updateComment);
router.delete('/forum/comment/delete/:id', auth, commentCtrl.deleteComment);

module.exports = router;