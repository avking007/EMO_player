const jwt = require('jsonwebtoken');
const config = require('../config/default');

module.exports = function (req, res, next) {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).send('Access Denied');
    }
    const decode = jwt.verify(token, config.jwtKey);
    req.user = decode.user;
    next();
  } catch (error) {
    return res.status(401).send('Invalid token.');
  }
};
