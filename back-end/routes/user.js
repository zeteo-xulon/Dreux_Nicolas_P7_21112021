const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const role = require('../middlewares/role');

router.post('/signup', userCtrl.signup);
router.get('/profile/:id', userCtrl.read);
router.post('/login', userCtrl.login);
router.put('/profile/:id', auth,multer,role, userCtrl.update);
router.delete('/profile/:id', auth, userCtrl.delete);

module.exports = router;