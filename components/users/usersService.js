const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String
});
const UserModel = mongoose.model('user', UserSchema);


exports.profile = async (email) => {
  const user = await UserModel.findOne({ email: email }).lean();
  if(!user){
    throw new Error('User not found');
  }
  return user;
}

exports.login = async (email, password) => {
  const user = await UserModel.findOne({ email: email }).lean();
  if (!user) {
    throw new Error('User not found');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Wrong password');
  }
  return user;
}

exports.register = async (fullName, email, password) => {
  // Verify that email does not exist
  const user = await UserModel.findOne({ email: email });
  if (user) {
    throw new Error('Email already exists');
  }
  // Hash password
  const hash = await bcrypt.hash(password, saltRounds);

  const newUser = new UserModel({
    fullName: fullName,
    email: email,
    password: hash
  });
  const account =await newUser.save();
  delete(account.password);
  return account;
}