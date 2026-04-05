const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized, no token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError(401, 'Not authorized, user not found');
    }

    if (user.status !== 'active') {
      throw new ApiError(403, 'Account is not active');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Token expired'));
    } else if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, `User role '${req.user ? req.user.role : 'unknown'}' is not authorized to access this route`));
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
