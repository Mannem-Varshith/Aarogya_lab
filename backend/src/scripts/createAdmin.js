const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

async function createAdmin() {
    const connection = await pool.getConnection();
    try {
        // Hash password for Admin@123
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        
        // Check if admin already exists
        const [existing] = await connection.query(
            'SELECT * FROM users WHERE role = ? AND name = ?',
            ['admin', 'Admin']
        );

        if (existing.length > 0) {
            // Update existing admin password
            await connection.query(
                'UPDATE users SET password = ? WHERE role = ? AND name = ?',
                [hashedPassword, 'admin', 'Admin']
            );
            console.log('Admin password updated successfully');
        } else {
            // Create new admin user
            const adminId = uuidv4();
            await connection.query(
                `INSERT INTO users (id, name, email, phone, password, role, approval_status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [adminId, 'Admin', 'admin@aarogya.com', '0000000000', hashedPassword, 'admin', 'approved']
            );
            console.log('Admin user created successfully');
        }
        
        console.log('Admin credentials:');
        console.log('Username: Admin');
        console.log('Password: Admin@123');
    } catch (error) {
        console.error('Error creating admin:', error);
        throw error;
    } finally {
        connection.release();
    }
}

// Run if called directly
if (require.main === module) {
    createAdmin()
        .then(() => {
            console.log('Admin setup complete');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Admin setup failed:', error);
            process.exit(1);
        });
}

module.exports = createAdmin;

