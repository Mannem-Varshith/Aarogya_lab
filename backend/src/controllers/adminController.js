const { pool } = require('../config/database');

// Get pending approvals (doctors and labs)
const getPendingApprovals = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [users] = await connection.query(
            `SELECT u.id, u.name, u.email, u.phone, u.role, u.approval_status, u.created_at,
                    d.specialization, l.address
             FROM users u
             LEFT JOIN doctors d ON u.id = d.user_id
             LEFT JOIN labs l ON u.id = l.user_id
             WHERE u.role IN ('doctor', 'lab') AND u.approval_status = 'pending'
             ORDER BY u.created_at DESC`
        );

        res.json({
            status: 'success',
            data: { users }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    } finally {
        connection.release();
    }
};

// Get all users (for admin dashboard)
const getAllUsers = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { role, approval_status } = req.query;
        
        let query = `SELECT u.id, u.name, u.email, u.phone, u.role, u.approval_status, u.created_at,
                            d.specialization, l.address
                     FROM users u
                     LEFT JOIN doctors d ON u.id = d.user_id
                     LEFT JOIN labs l ON u.id = l.user_id
                     WHERE u.role != 'admin'`;
        
        const params = [];
        
        if (role) {
            query += ' AND u.role = ?';
            params.push(role);
        }
        
        if (approval_status) {
            query += ' AND u.approval_status = ?';
            params.push(approval_status);
        }
        
        query += ' ORDER BY u.created_at DESC';
        
        const [users] = await connection.query(query, params);

        res.json({
            status: 'success',
            data: { users }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    } finally {
        connection.release();
    }
};

// Approve user (doctor or lab)
const approveUser = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { userId } = req.params;

        // Check if user exists and is doctor or lab
        const [users] = await connection.query(
            'SELECT * FROM users WHERE id = ? AND role IN (?, ?)',
            [userId, 'doctor', 'lab']
        );

        if (users.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found or cannot be approved'
            });
        }

        // Update approval status
        await connection.query(
            'UPDATE users SET approval_status = ? WHERE id = ?',
            ['approved', userId]
        );

        res.json({
            status: 'success',
            message: 'User approved successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    } finally {
        connection.release();
    }
};

// Reject user (doctor or lab)
const rejectUser = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { userId } = req.params;

        // Check if user exists and is doctor or lab
        const [users] = await connection.query(
            'SELECT * FROM users WHERE id = ? AND role IN (?, ?)',
            [userId, 'doctor', 'lab']
        );

        if (users.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found or cannot be rejected'
            });
        }

        // Update approval status
        await connection.query(
            'UPDATE users SET approval_status = ? WHERE id = ?',
            ['rejected', userId]
        );

        res.json({
            status: 'success',
            message: 'User rejected successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    } finally {
        connection.release();
    }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [totalUsers] = await connection.query(
            'SELECT COUNT(*) as count FROM users WHERE role != ?',
            ['admin']
        );
        
        const [pendingApprovals] = await connection.query(
            'SELECT COUNT(*) as count FROM users WHERE role IN (?, ?) AND approval_status = ?',
            ['doctor', 'lab', 'pending']
        );
        
        const [doctors] = await connection.query(
            'SELECT COUNT(*) as count FROM users WHERE role = ?',
            ['doctor']
        );
        
        const [labs] = await connection.query(
            'SELECT COUNT(*) as count FROM users WHERE role = ?',
            ['lab']
        );
        
        const [patients] = await connection.query(
            'SELECT COUNT(*) as count FROM users WHERE role = ?',
            ['patient']
        );

        res.json({
            status: 'success',
            data: {
                totalUsers: totalUsers[0].count,
                pendingApprovals: pendingApprovals[0].count,
                doctors: doctors[0].count,
                labs: labs[0].count,
                patients: patients[0].count
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    getPendingApprovals,
    getAllUsers,
    approveUser,
    rejectUser,
    getDashboardStats
};

