const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');

router.post('/comment', commentCtrl.createComment);
router.get('/comment', commentCtrl.readComment);
router.put('/comment', commentCtrl.updateComment);
router.delete('/comment',commentCtrl.deleteComment);

module.exports = router;