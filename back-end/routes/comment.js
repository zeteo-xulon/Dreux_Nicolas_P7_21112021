const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.post('/comment/create/:id',auth, multer, commentCtrl.createComment);
router.get('/comment', commentCtrl.readComment);
router.put('/comment/update/:id', auth, multer, commentCtrl.updateComment);
router.delete('/comment/delete/:id', auth, commentCtrl.deleteComment);

module.exports = router;