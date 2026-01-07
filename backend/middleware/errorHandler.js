// middleware/errorHandler.js - Global Error Handler (ES Modules)
const errorHandler = (err, _req, res, _next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.errors.map(e => e.message)
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      error: 'Duplicate Entry',
      details: err.errors.map(e => e.message)
    });
  }

  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      success: false,
      error: 'Database Connection Error'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message
  });
};

export default errorHandler;
