const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error
  let statusCode = 500;
  let message = 'Internal server error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.code === 'ER_DUP_ENTRY' || err.code === 23505) {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 23503) {
    statusCode = 400;
    message = 'Referenced resource not found';
  } else if (err.message) {
    message = err.message;
    
    // Try to extract status code from message
    if (message.includes('400')) statusCode = 400;
    else if (message.includes('401')) statusCode = 401;
    else if (message.includes('403')) statusCode = 403;
    else if (message.includes('404')) statusCode = 404;
    else if (message.includes('409')) statusCode = 409;
  }
  
  // Don't expose detailed error messages in production
  const isProduction = process.env.NODE_ENV === 'production';
  const errorResponse = {
    success: false,
    message: isProduction && statusCode === 500 ? 'Internal server error' : message,
    ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack })
  };
  
  res.status(statusCode).json(errorResponse);
};

const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

// Async wrapper to catch async errors
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorMiddleware,
  notFoundMiddleware,
  asyncHandler
};