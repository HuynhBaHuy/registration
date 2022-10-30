var express = require('express');
var router = express.Router();
const usersController = require('./usersController');

router.get('/login', usersController.login);

router.post('/register', usersController.register);

module.exports = router;
