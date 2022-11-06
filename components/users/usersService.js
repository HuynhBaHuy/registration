const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String
});
const UserModel = mongoose.model('user', UserSchema);


exports.profile = async (_id) => {
  console.log("id", _id);
  const user = (await UserModel.findOne({ _id: _id })).toObject();
  if (!user) {
    return {
      code: 404,
      message: 'User not found'
    }
  }
  delete (user.password);
  return {
    code: 200,
    data: user
  };
}

exports.login = async (email, password) => {
  const user = (await UserModel.findOne({ email: email })).toObject();
  if (!user) {
    return {
      code: 404,
      message: 'User not found'
    }
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return {
      code: 401,
      message: 'Invalid password'
    }
  }
  // Create token
  const token = jwt.sign(
    { user_id: user._id, email },
    process.env.TOKEN_KEY,
    {
      expiresIn: '2h',
    }
  );
  delete (user.password);
  user.token = token;
  return {
    code: 200,
    data: user
  };
}

exports.register = async (fullName, email, password) => {
  // Verify that email does not exist
  const user = await UserModel.findOne({ email: email });
  if (user) {
    return {
      code: 409,
      message: 'Email already exists'
    }
  }
  // Hash password
  const hash = await bcrypt.hash(password, saltRounds);

  const newUser = new UserModel({
    fullName: fullName,
    email: email.toLowerCase(),
    password: hash
  });
  const account = (await newUser.save()).toObject();
  // Create token
  const token = jwt.sign(
    { user_id: account._id, email },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );
  console.log("token", token);
  return {
    code: 200,
    data: {
      email: account.email,
      fullName: account.fullName,
      token:  token
    }
  };
}