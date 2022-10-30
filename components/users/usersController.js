const db = require('../../database/MongoDB')
const usersService = require('./usersService');

module.exports.login = async (req, res) => {
  try {
    await db.connect();
    const { email, password } = req.body;
    const user = await usersService.login(email, password);
    res.json(user)
    await db.close();
  } catch (e) {
    await db.close();
    res.status(400).json({ errorMessage: e.message ?? 'Unknown error' });
  }
}

module.exports.register = async (req, res) => {
  try {
    await db.connect();
    const { fullName, email, password } = req.body;
    const result = await usersService.register(fullName, email, password)
    res.json(result)
    await db.close()
  } catch (e) {
    await db.close();
    res.status(400).json({ errorMessage: e.message ?? 'Unknown error' });
  }
};