const db = require('../../database/MongoDB')
const usersService = require('./usersService');

module.exports.profile = (req, res) => {
  res.json(usersService.profile(1));
}

module.exports.register = async (req, res) => {
  try {
    await db.connect();
    const { fullName, email, password} = req.body;
    res.status(201).json(usersService.register(fullName, email, password))
    await db.close()
  } catch (e) {
    await db.close();
    res.status(400).json({errorMessage: e.message ?? 'Unknown error'});
  }
};