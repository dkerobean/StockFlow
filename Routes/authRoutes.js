const express = require('express');
const userController = require('../controllers/authController');
const router = express.Router();

// GET routes
router.get('/signup', (req, res) => {
  res.render('Auth/signup', {
    error: null,
    name: '',
    email: ''
  });
});

router.get('/login', (req, res) => {
  res.render('Auth/login', {
    error: null
  });
});

// POST routes - make sure these match your form action paths
router.post('/user-signup', userController.signup);
router.post('/user-login', userController.login);

module.exports = router;