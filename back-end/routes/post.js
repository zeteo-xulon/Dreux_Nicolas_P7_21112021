const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middlewares/auth');

router.post('/forum/create/:id', auth, postCtrl.createPost);
router.get('/forum', postCtrl.readPost);
router.put('/forum/update', auth, postCtrl.updatePost);
router.delete('/forum/delete', auth, postCtrl.deletePost);

module.exports = router;