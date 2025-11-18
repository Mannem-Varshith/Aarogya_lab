const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getPendingApprovals, getAllUsers, approveUser, rejectUser, getDashboardStats } = require('../controllers/adminController');

// All admin routes require authentication
router.use(verifyToken);

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};

router.use(isAdmin);

// Admin routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/approvals/pending', getPendingApprovals);
router.get('/users', getAllUsers);
router.put('/approvals/:userId/approve', approveUser);
router.put('/approvals/:userId/reject', rejectUser);

module.exports = router;

