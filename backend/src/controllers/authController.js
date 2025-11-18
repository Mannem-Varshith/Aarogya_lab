const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

// Helper function to get role-specific details
const getRoleSpecificDetails = async (connection, userId, role) => {
    if (role === 'doctor') {
        const [doctorDetails] = await connection.query(
            'SELECT * FROM doctors WHERE user_id = ?',
            [userId]
        );
        return doctorDetails[0] ? {
            specialization: doctorDetails[0].specialization
        } : {};
    } else if (role === 'lab') {
        const [labDetails] = await connection.query(
            'SELECT * FROM labs WHERE user_id = ?',
            [userId]
        );
        return labDetails[0] ? {
            address: labDetails[0].address
        } : {};
    } else if (role === 'patient') {
        const [patientDetails] = await connection.query(
            'SELECT * FROM patients WHERE user_id = ?',
            [userId]
        );
        return patientDetails[0] ? {
            age: patientDetails[0].age,
            gender: patientDetails[0].gender
        } : {};
    }
    return {};
};

// Reset password
const resetPassword = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { phone, newPassword } = req.body;

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await connection.query(
            'UPDATE users SET password = ? WHERE phone = ?',
            [hashedPassword, phone]
        );

        res.json({
            status: 'success',
            message: 'Password reset successfully'
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

// Register a new user
const register = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { name, email, phone, password, role, ...additionalInfo } = req.body;

        // Check for required fields
        if (!name || !email || !phone || !password || !role) {
            throw new Error('Missing required fields');
        }

        // Check if user exists
        const [existingUsers] = await connection.query(
            'SELECT * FROM users WHERE email = ? OR phone = ?',
            [email, phone]
        );

        if (existingUsers.length > 0) {
            throw new Error('User with this email or phone already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        // Set approval_status: patients are auto-approved, doctors and labs need approval
        const approvalStatus = role === 'patient' ? 'approved' : 'pending';

        // Insert user
        await connection.query(
            'INSERT INTO users (id, name, email, phone, password, role, approval_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, name, email, phone, hashedPassword, role, approvalStatus]
        );

        // Insert role-specific information
        if (role === 'doctor') {
            await connection.query(
                'INSERT INTO doctors (id, user_id, specialization) VALUES (?, ?, ?)',
                [uuidv4(), userId, additionalInfo.specialization]
            );
        } else if (role === 'lab') {
            await connection.query(
                'INSERT INTO labs (id, user_id, address) VALUES (?, ?, ?)',
                [uuidv4(), userId, additionalInfo.address]
            );
        } else if (role === 'patient') {
            await connection.query(
                'INSERT INTO patients (id, user_id, age, gender) VALUES (?, ?, ?, ?)',
                [uuidv4(), userId, additionalInfo.age, additionalInfo.gender]
            );
        }

        await connection.commit();

        // Get role-specific details
        const additionalDetails = await getRoleSpecificDetails(connection, userId, role);

        // For doctors and labs, don't generate token until approved
        let token = null;
        if (approvalStatus === 'approved') {
            token = generateToken({ id: userId, role });
        }

        const response = {
            status: 'success',
            data: {
                user: {
                    id: userId,
                    name,
                    email,
                    phone,
                    role,
                    approval_status: approvalStatus,
                    ...additionalDetails
                }
            }
        };

        if (token) {
            response.data.token = token;
        } else {
            response.message = 'Your account is pending approval. You will be able to login once approved by admin.';
        }

        res.status(201).json(response);
    } catch (error) {
        await connection.rollback();
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    } finally {
        connection.release();
    }
};

// Admin login (separate endpoint)
const adminLogin = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username and password are required'
            });
        }

        // Find admin user by name
        const [admins] = await connection.query(
            'SELECT * FROM users WHERE role = ? AND name = ?',
            ['admin', username]
        );

        const admin = admins[0];
        if (!admin) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid admin credentials'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid admin credentials'
            });
        }

        const token = generateToken(admin);

        res.json({
            status: 'success',
            data: {
                token,
                user: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                }
            }
        });
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: error.message
        });
    } finally {
        connection.release();
    }
};

// Login user
const login = async (req, res) => {
    console.log('Login request received:', req.body);
    const connection = await pool.getConnection();
    try {
        const { phone, password, role } = req.body;
        console.log('Login attempt:', { phone, role, password: '***' });

        if (!phone || !password) {
            console.log('Missing phone or password');
            return res.status(400).json({
                status: 'error',
                message: 'Phone and password are required'
            });
        }


        // First check if user exists without role constraint
        const [allUsers] = await connection.query(
            'SELECT * FROM users WHERE phone = ?',
            [phone]
        );
        console.log('Users found with this phone:', allUsers.length);
        if (allUsers.length > 0) {
            console.log('User roles found:', allUsers.map(u => u.role).join(', '));
        }

        // Get user with role
        const [users] = await connection.query(
            'SELECT * FROM users WHERE phone = ? AND role = ?',
            [phone, role]
        );
        console.log('Found users with matching role:', users.length);
        console.log('Query parameters:', { phone, role });

        const user = users[0];
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'No user found with this phone number and role'
            });
        }

        // Check approval status for doctors and labs
        if ((user.role === 'doctor' || user.role === 'lab') && user.approval_status !== 'approved') {
            if (user.approval_status === 'pending') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Your account is pending approval. Please wait for admin approval.'
                });
            } else if (user.approval_status === 'rejected') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Your account has been rejected. Please contact admin.'
                });
            }
        }

        console.log('Found user:', { 
            id: user.id, 
            phone: user.phone, 
            role: user.role,
            approval_status: user.approval_status,
            hasPassword: !!user.password,
            storedHash: user.password
        });

        try {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('Password validation result:', isPasswordValid);
            
            if (!isPasswordValid) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid password'
                });
            }
        } catch (error) {
            console.error('Password comparison error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error validating password'
            });
        }

        // Generate token and get user details
        const token = generateToken(user);
        console.log('Generated token for user');

        // Get role-specific details
        const additionalDetails = await getRoleSpecificDetails(connection, user.id, user.role);

        // Send response with explicit headers
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
        
        const responseData = {
            status: 'success',
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    ...additionalDetails
                }
            }
        };
        
        console.log('Sending login response:', JSON.stringify(responseData, null, 2));
        res.status(200).json(responseData);
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: error.message
        });
    } finally {
        connection.release();
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        // Get user details
        const [users] = await connection.query(
            'SELECT id, name, email, phone, role FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            throw new Error('User not found');
        }

        const user = users[0];
        const additionalDetails = await getRoleSpecificDetails(connection, user.id, user.role);

        res.json({
            status: 'success',
            data: {
                user: {
                    ...user,
                    ...additionalDetails
                }
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error.message
        });
    } finally {
        connection.release();
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { name, phone, ...roleSpecificData } = req.body;

        // Check for duplicate phone
        if (phone) {
            const [existingUsers] = await connection.query(
                'SELECT * FROM users WHERE phone = ? AND id != ?',
                [phone, req.user.id]
            );

            if (existingUsers.length > 0) {
                throw new Error('Phone number already in use');
            }
        }

        // Update user table
        await connection.query(
            'UPDATE users SET name = ?, phone = ? WHERE id = ?',
            [name, phone, req.user.id]
        );

        // Update role-specific table
        if (req.user.role === 'doctor' && roleSpecificData.specialization) {
            await connection.query(
                'UPDATE doctors SET specialization = ? WHERE user_id = ?',
                [roleSpecificData.specialization, req.user.id]
            );
        } else if (req.user.role === 'patient' && (roleSpecificData.age || roleSpecificData.gender)) {
            await connection.query(
                'UPDATE patients SET age = ?, gender = ? WHERE user_id = ?',
                [roleSpecificData.age, roleSpecificData.gender, req.user.id]
            );
        }

        await connection.commit();

        // Get updated profile
        const [users] = await connection.query(
            'SELECT id, name, email, phone, role FROM users WHERE id = ?',
            [req.user.id]
        );

        const user = users[0];
        const additionalDetails = await getRoleSpecificDetails(connection, user.id, user.role);

        res.json({
            status: 'success',
            data: {
                user: {
                    ...user,
                    ...additionalDetails
                }
            }
        });
    } catch (error) {
        console.error('Auth error:', error);
        await connection.rollback();
        res.status(400).json({
            status: 'error',
            message: error.message || 'An error occurred during authentication'
        });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    register,
    login,
    adminLogin,
    resetPassword,
    getProfile,
    updateProfile
};