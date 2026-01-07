const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const response = require('../utils/response');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.error(res, 'Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email']
    });

    if (!user) {
      return response.error(res, 'User not found', 401);
    }

    // Inject user ke request
    req.user = user;

    next();
  } catch (err) {
    return response.error(res, 'Invalid token', 401);
  }
};
