const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/home', userCtrl.signup);
router.post('/home', userCtrl.login);

module.exports = router;