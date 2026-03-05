// Centralized error handler
module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    error: {
      message,
    },
  });
};

