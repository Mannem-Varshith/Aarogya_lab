const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getProfile, updateProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);

// Protected routes
router.use(verifyToken);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;