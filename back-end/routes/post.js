const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.post('/forum/create/:id', auth, multer, postCtrl.createPost);
router.get('/forum', postCtrl.readPost);
router.put('/forum/update/:id', auth, multer, postCtrl.updatePost);
router.delete('/forum/delete/:id', auth, multer, postCtrl.deletePost);

module.exports = router;