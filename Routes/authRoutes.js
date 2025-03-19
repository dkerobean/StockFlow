const express = require('express');
const userController = require('../controllers/authController');
const router = express.Router();

// GET routes for rendering pages
router.get('/signup', (req, res) => {
  res.render('Auth/signup', { error: null });  // Make sure to pass error: null
});

router.get('/login', (req, res) => {
  res.render('Auth/login', { error: null });
});

// POST routes for form submission
router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;