const usersService = require('../components/users/usersService');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const { config } = require('./config')
module.exports.applyPassportStrategy = (passport) => {
    const opt = {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.passport.accessSecret,
    }
    passport.use(new JWTStrategy(opt, (payload, done) => {
        console.log('payload', payload);
        usersService.getUserById(payload.user_id).then((user) => {
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        }).catch((err) => {
            return done(err, false);
        })
    }));
}