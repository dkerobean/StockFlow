const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to create JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Send token to client
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // Set cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  };

  // Send cookie with token
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Signup controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user with that email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('signup', {
        error: 'User with that email already exists',
        name: req.body.name,
        email: req.body.email
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      role: role || 'staff' // Default to staff if no role provided
    });

    // Update last login
    newUser.lastLogin = Date.now();
    await newUser.save({ validateBeforeSave: false });

    // If it's an AJAX request, send JSON response
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return createSendToken(newUser, 201, req, res);
    }

    // For form submission, redirect to dashboard or login
    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    return res.redirect('/dashboard');
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(400).render('signup', {
      error: err.message || 'An error occurred during signup',
      name: req.body.name,
      email: req.body.email
    });
  }
};

// Login controller (for completeness)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).render('login', {
        error: 'Please provide email and password'
      });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).render('login', {
        error: 'Incorrect email or password'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // If it's an AJAX request, send JSON response
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return createSendToken(user, 200, req, res);
    }

    // For form submission, redirect to dashboard
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    return res.status(400).render('login', {
      error: err.message || 'An error occurred during login'
    });
  }
};