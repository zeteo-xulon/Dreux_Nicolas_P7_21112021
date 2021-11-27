const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/update', userCtrl.update);
router.delete('/delete', userCtrl.delete);

module.exports = router;