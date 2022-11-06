var express = require('express');
var router = express.Router();
const usersController = require('./usersController');
const { auth } = require('../../middlewares');
router.get('/profile', auth, usersController.profile);

router.post('/login', usersController.login);

router.post('/register', usersController.register);

module.exports = router;
