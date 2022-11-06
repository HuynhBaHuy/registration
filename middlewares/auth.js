const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      code: 403,
      message: "No token provided!",
    });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    console.log("decoded", decoded);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({
      code: 401,
      message: "Invalid token!",
    });
  }
  return next();
};

module.exports = verifyToken;