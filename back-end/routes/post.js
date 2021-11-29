const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');

router.post('/post', postCtrl.createPost);
router.get('/post', postCtrl.readPost);
router.put('/post', postCtrl.updatePost);
router.delete('/post',postCtrl.deletePost);

module.exports = router;