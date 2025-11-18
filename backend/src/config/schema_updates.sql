-- Database Updates for Admin and Approval System
-- Run this after the initial schema.sql

USE m_aarogya;

-- Add 'admin' role to users table
ALTER TABLE users MODIFY COLUMN role ENUM('patient', 'doctor', 'lab', 'admin') NOT NULL;

-- Add approval_status column for doctors and labs
ALTER TABLE users ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';

-- Create labs table if it doesn't exist (for lab-specific details)
CREATE TABLE IF NOT EXISTS labs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Update approval_status: patients are auto-approved, doctors and labs need approval
-- Set existing doctors and labs to 'approved' (for existing data)
UPDATE users SET approval_status = 'approved' WHERE role IN ('doctor', 'lab');
-- Patients are auto-approved
UPDATE users SET approval_status = 'approved' WHERE role = 'patient';

-- Create admin user (username: Admin, password: Admin@123)
-- Password hash for "Admin@123" - you'll need to generate this with bcrypt
-- For now, we'll create a script to insert it properly
INSERT INTO users (id, name, email, phone, password, role, approval_status) 
VALUES (
    UUID(),
    'Admin',
    'admin@aarogya.com',
    '0000000000',
    '$2a$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q',
    'admin',
    'approved'
) ON DUPLICATE KEY UPDATE name = 'Admin';

-- Add index for approval_status queries
ALTER TABLE users ADD INDEX idx_approval_status (approval_status);

-- Add index for role and approval_status combination
ALTER TABLE users ADD INDEX idx_role_approval (role, approval_status);

