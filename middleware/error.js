exports.globalErrorHandler = (err, req, res, next) => {
  console.error('ERROR 💥:', err.stack);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'development'
    ? err.message
    : 'Something went wrong!';

  // For API requests
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.status(statusCode).json({
      status: 'error',
      message
    });
  }

  // For regular page requests
  res.status(statusCode).render('error', {
    error: message
  });
};

// Catch 404 errors
exports.notFound = (req, res, next) => {
  res.status(404).render('404', {
    title: 'Page Not Found'
  });
};