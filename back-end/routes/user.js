const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.post('/signup', userCtrl.signup);
router.get('/verify-user', auth, userCtrl.verify);
router.get('/profile/:id', auth, userCtrl.read);
router.post('/login', userCtrl.login);
router.put('/profile/:id', auth, userCtrl.update);
router.put('/profile/password/:id', auth, userCtrl.updatePassword);
router.put('/profile/images/:id', auth, multer, userCtrl.updateProfileImage);
router.delete('/profile/:id', auth, userCtrl.delete);

module.exports = router;