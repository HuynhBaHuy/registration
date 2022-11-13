var express = require('express');
var router = express.Router();
var passport = require('passport');
const usersController = require('./usersController');
router.get('/profile', passport.authenticate('jwt', { session: false }), usersController.profile);

router.post('/login', usersController.login);

router.post('/register', usersController.register);
router.post('/refresh-token', usersController.refreshToken);
module.exports = router;
