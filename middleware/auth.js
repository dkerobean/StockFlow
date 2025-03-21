// Protect routes middleware
exports.protect = (req, res, next) => {
  // 1) Check if user is logged in via session
  if (req.session.user) return next();

  // 2) Fallback to JWT token check
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      User.findById(decoded.id).then(user => {
        req.user = user;
        return next();
      });
    } catch (err) {
      return res.redirect('/login');
    }
  } else {
    return res.redirect('/login');
  }
};

// Role-based access control
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).render('error', {
        error: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};