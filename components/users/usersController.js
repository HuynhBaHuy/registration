const usersService = require('./usersService');

module.exports.profile = (req, res) => {
  res.json(usersService.profile(1));
}

module.exports.register = (req, res) => {
  try {
    const { fullName, email, password} = req.body;
    // User input validation
    // ...

    res.status(201).json(usersService.register(fullName, email, password))
  } catch (e) {
    res.status(400).json({errorMessage: e.message ?? 'Unknown error'});
  }
};