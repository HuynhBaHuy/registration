const jwt = require('jsonwebtoken');
const { config } = require('../middlewares/config');

module.exports = {
    generateServerErrorCode: (res, code, fullError, msg, location = 'server') => {
        const errors = {};
        errors[location] = {
            fullError,
            msg,
        };
        return res.status(code).json({
            code,
            fullError,
            errors,
        });
    },
    generateAccessToken: (userId, email) => {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { user_id: userId, email },
                config.passport.accessSecret,
                {
                    expiresIn: config.passport.accessExpiresIn,
                },
                (err, token) => {
                    if (err) {
                        console.log(err.message);
                        reject(err);
                    }
                    resolve(token);
                }
            );
        })
    },
    generateRefreshToken: (userId, email) => {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { user_id: userId, email },
                config.passport.refreshSecret,
                {
                    expiresIn: config.passport.refreshExpiresIn,
                },
                (err, token) => {
                    if (err) {
                        console.log(err.message);
                        reject(err);
                    }
                    resolve(token);
                }
            );
        })
    }
}