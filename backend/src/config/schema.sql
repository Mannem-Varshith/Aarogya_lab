-- MySQL Schema for M-Aarogya Pathology Lab Management System

-- Create the database
CREATE DATABASE IF NOT EXISTS m_aarogya;
USE m_aarogya;

-- Users table for storing core user and authentication data
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID_V4()),
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Doctors table for storing doctor-specific details
CREATE TABLE IF NOT EXISTS doctors (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID_V4()),
    user_id CHAR(36) NOT NULL,
    specialization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patients table for storing patient-specific details
CREATE TABLE IF NOT EXISTS patients (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID_V4()),
    user_id CHAR(36) NOT NULL,
    age INT,
    gender VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reports table for managing lab reports
CREATE TABLE IF NOT EXISTS reports (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID_V4()),
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comments for documentation
ALTER TABLE users COMMENT 'Core user table storing authentication and role information';
ALTER TABLE doctors COMMENT 'Extended information specific to doctor users';
ALTER TABLE patients COMMENT 'Extended information specific to patient users';
ALTER TABLE reports COMMENT 'Lab reports and test results management';