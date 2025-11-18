const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetPassword() {
    // Create the connection
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '123456789',
        database: process.env.DB_NAME || 'm_aarogya'
    });

    try {
        // Update password for the specific user
        const hashedPassword = '$2a$10$SJVKBOSS5eZskIyf5YCI3OUGUU0uHP8WRRGsvICu9L2AUoFUCcqSW'; // Hash of '123456789'
        await connection.execute(
            'UPDATE users SET password = ? WHERE phone = ?',
            [hashedPassword, '9032612597']
        );
        console.log('Password updated successfully');

        // Verify the update
        const [rows] = await connection.execute(
            'SELECT id, phone, role FROM users WHERE phone = ?',
            ['9032612597']
        );
        console.log('User verified:', rows[0]);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

resetPassword();