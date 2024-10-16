function errorHandler(err, req, res, next) {
  // Log the full error, request details, and any other information that can help in debugging
  console.error('Error Message:', err.message);
  console.error('Stack Trace:', err.stack);
  console.error('Request URL:', req.url);
  console.error('Request Method:', req.method);
  console.error('Request Params:', req.params);
  console.error('Request Body:', req.body);
  console.error('Request Query:', req.query);

  // Set default status code and message
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  // Send response with error message and stack (stack only in development mode)
  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack, // Hide stack trace in production
  });
}

module.exports = errorHandler;
