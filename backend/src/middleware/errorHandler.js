const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err.message);

  const statusCode = err.statusCode || 400;
  const message = err.message || 'An error occurred';

  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString()
  });
};

export default errorMiddleware;
