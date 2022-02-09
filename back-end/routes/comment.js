const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');
const auth = require('../middlewares/auth');

router.post('/comment/create/:id',auth, commentCtrl.createComment);
router.get('/comment', commentCtrl.readComment);
router.put('/comment/update/:id', auth, commentCtrl.updateComment);
router.delete('/comment/delete/:id', auth, commentCtrl.deleteComment);

module.exports = router;