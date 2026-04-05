const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof Error ? 400 : 500;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const response = {
    code: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode || 500).json(response);
};

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Not found - ${req.originalUrl}`));
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
