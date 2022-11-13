module.exports.config = {
    passport: {
        accessSecret: process.env.ACCESS_TOKEN_KEY,
        refreshSecret: process.env.REFRESH_TOKEN_KEY,
        accessExpiresIn: '2h',
        refreshExpiresIn: '7d',
    },
}