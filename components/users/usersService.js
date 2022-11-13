const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { generateAccessToken, generateRefreshToken } = require('../../utils');
const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String
});
const UserModel = mongoose.model('user', UserSchema);

const refreshTokens = {};
class UserService {
  getUserById = async (id) => {
    console.log('id', id);
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  };

  profile = async (_id) => {
    console.log("id", _id);
    const user = (await UserModel.findOne({ _id: _id }))?.toObject();
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

  login = async (email, password) => {
    const user = (await UserModel.findOne({ email: email }))?.toObject();
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
    const accessToken = await generateAccessToken(user._id, user.email);
    const refreshToken = await generateRefreshToken(user._id, user.email);
    refreshTokens[refreshToken] = {
      accessToken,
      userId: user._id,
      email: user.email
    };
    delete (user.password);
    return {
      code: 200,
      data: {
        ...user,
        session: {
          accessToken,
          refreshToken
        }
      }
    };
  }

  register = async (fullName, email, password) => {
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
    const account = (await newUser.save())?.toObject();
    // Create token
    const accessToken = await generateAccessToken(account._id, account.email);
    console.log("accessToken", accessToken);
    const refreshToken = await generateRefreshToken(account._id, account.email);
    console.log("refreshToken", refreshToken);
    refreshTokens[refreshToken] = {
      accessToken,
      userId: account._id,
      email: account.email
    };
    return {
      code: 200,
      data: {
        email: account.email,
        fullName: account.fullName,
        session: {
          accessToken,
          refreshToken
        }
      }
    };
  }
  refreshToken = async (refreshToken) => {
    if (refreshToken && (refreshToken in refreshTokens)) {
      const userId = refreshTokens[refreshToken].userId;
      const email = refreshTokens[refreshTokens].email;
      const accessToken = await generateAccessToken(userId, email);
      refreshTokens[refreshToken].accessToken = accessToken;
      return {
        code: 200,
        data: {
          session: {
            accessToken,
            refreshToken
          }
        }
      };
    }
  }
}

module.exports = new UserService();