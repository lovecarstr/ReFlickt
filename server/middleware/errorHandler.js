function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log the error stack trace for debugging

  // Set default status code and message
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message: message,
    // In production, you might not want to expose the stack trace
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}

module.exports = errorHandler;
