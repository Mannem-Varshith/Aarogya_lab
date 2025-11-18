const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456789',
    database: process.env.DB_NAME || 'm_aarogya',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create the connection pool
const pool = mysql.createPool(dbConfig);

// Test the database connection and initialize schema
async function testConnection() {
    let connection;
    try {
        console.log('Attempting to connect to database with config:', {
            ...dbConfig,
            password: 'HIDDEN'
        });
        
        connection = await pool.getConnection();
        console.log('Database connection successful');
        
        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'm_aarogya'}`);
        await connection.query(`USE ${process.env.DB_NAME || 'm_aarogya'}`);

        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('patient', 'doctor', 'lab') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_phone (phone),
                INDEX idx_role (role)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Create doctors table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS doctors (
                id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
                user_id CHAR(36) NOT NULL,
                specialization VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Create patients table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS patients (
                id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
                user_id CHAR(36) NOT NULL,
                age INT,
                gender VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Create reports table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS reports (
                id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
                patient_id CHAR(36) NOT NULL,
                doctor_id CHAR(36),
                lab_user_id CHAR(36),
                test_name VARCHAR(255) NOT NULL,
                status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
                priority ENUM('normal', 'high', 'low', 'urgent') NOT NULL DEFAULT 'normal',
                file_path VARCHAR(255) NOT NULL,
                notes TEXT,
                test_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
                FOREIGN KEY (lab_user_id) REFERENCES users(id) ON DELETE SET NULL,
                INDEX idx_patient_id (patient_id),
                INDEX idx_doctor_id (doctor_id),
                INDEX idx_lab_user_id (lab_user_id),
                INDEX idx_status (status),
                INDEX idx_test_date (test_date)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('Database schema initialized successfully');
        return true;
    } catch (error) {
        console.error('Database Connection Error Details:');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Code:', error.code);
        console.error('Error Number:', error.errno);
        
        if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
            console.error('Environment variables not loaded properly. Please check your .env file.');
            console.error('Required variables:', {
                DB_HOST: process.env.DB_HOST || 'not set',
                DB_USER: process.env.DB_USER || 'not set',
                DB_NAME: process.env.DB_NAME || 'not set',
                DB_PASSWORD: process.env.DB_PASSWORD ? 'set' : 'not set'
            });
        }
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\nPossible solutions:');
            console.error('1. Check if MySQL server is running');
            console.error('2. Verify your MySQL root password');
            console.error('3. Try running these MySQL commands:');
            console.error('   ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'123456789\';');
            console.error('   FLUSH PRIVILEGES;');
        }
        
        return false;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// Export without auto-initializing
module.exports = {
    pool,
    testConnection
};
