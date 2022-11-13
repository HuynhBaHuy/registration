const usersService = require('./usersService');

module.exports.profile = async (req, res) => {
  console.log("req", req.user);
  try {
    const result = await usersService.profile(req.user._id);
    res.status(result.code).send(result);
  } catch (err) {
    res.status(500).send({
      code: 500,
      message: err.message ?? 'Unknown error',
    });
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
    const result = await usersService.login(email, password);
    res.status(result.code).send(result);
  } catch (e) {
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
    const result = await usersService.register(fullName, email, password)
    res.status(result.code).send(result);
  } catch (e) {
    res.status(500).send({ code: 500, message: e.message ?? 'Unknown error' });
  }
};

module.exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if(!refreshToken) {
      res.status(400).send({ code: 400, message: 'Missing required fields' });
      return;
    }
    const result = await usersService.refreshToken(refreshToken);
    res.status(result.code).send(result);
  } catch (e) {
    res.status(500).send({ code: 500, message: e.message ?? 'Unknown error' });
  }
}