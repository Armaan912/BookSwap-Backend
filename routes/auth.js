const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', authController.validateRegister, authController.register);
router.post('/login', authController.validateLogin, authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
