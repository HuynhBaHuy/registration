const db = require('../../database/MongoDB')
const usersService = require('./usersService');

module.exports.profile = async (req, res) => {
  try {
    await db.connect();
    const result = await usersService.profile(req.user.user_id);
    res.status(result.code).send(result);
    await db.close();
  } catch (err) {
    await db.close();
    res.status(500).send({
      code: 500,
      message: err.message ?? 'Unknown error',
    });
    await db.close();
  }
}

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email && !password) {
      res.status(400).send({
        code: 400,
        message: 'Email and password are required',
      });
      return;
    }
    await db.connect();
    const result = await usersService.login(email, password);
    res.status(result.code).send(result);
    await db.close();
  } catch (e) {
    await db.close();
    res.status(500).send({ code: 500, message: e.message ?? 'Unknown error' });
  }
}

module.exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if(!fullName && !email && !password) {
      res.status(400).send({ code: 400, message: 'Missing required fields' });
      return;
    }
    await db.connect();
    const result = await usersService.register(fullName, email, password)
    res.status(result.code).send(result);
    await db.close()
  } catch (e) {
    await db.close();
    res.status(500).send({ code: 500, message: e.message ?? 'Unknown error' });
  }
};