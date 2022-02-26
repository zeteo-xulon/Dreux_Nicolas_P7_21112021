const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');
const auth = require('../middlewares/auth');

router.post('/forum/comment/create/:id', auth, commentCtrl.createComment);
router.get('/forum/comment/:id', commentCtrl.readComment);
router.put('/forum/comment/update/:id', auth, commentCtrl.updateComment);
router.delete('/forum/comment/delete/:id', auth, commentCtrl.deleteComment);

module.exports = router;