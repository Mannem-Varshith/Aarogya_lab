const { pool } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

// Upload a new report
const uploadReport = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            status: 'error',
            message: 'No file uploaded'
        });
    }

    try {
        const {
            patientId,
            doctorId,
            testName,
            priority = 'normal',
            notes,
            testDate
        } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO reports (
                patient_id,
                doctor_id,
                lab_user_id,
                test_name,
                priority,
                file_path,
                notes,
                test_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                patientId,
                doctorId,
                req.user.id,
                testName,
                priority,
                req.file.path,
                notes,
                testDate
            ]
        );

        res.status(201).json({
            status: 'success',
            data: {
                reportId: result.insertId,
                filePath: req.file.path
            }
        });
    } catch (error) {
        // Delete uploaded file if database insertion fails
        await fs.unlink(req.file.path).catch(console.error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get reports for a patient
const getPatientReports = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        // Check authorization
        if (req.user.role === 'patient' && req.user.id !== patientId) {
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized access'
            });
        }

        const [reports] = await pool.execute(
            `SELECT r.*, 
                    u_lab.name as lab_technician_name,
                    u_doc.name as doctor_name,
                    d.specialization as doctor_specialization
             FROM reports r
             LEFT JOIN users u_lab ON r.lab_user_id = u_lab.id
             LEFT JOIN doctors d ON r.doctor_id = d.id
             LEFT JOIN users u_doc ON d.user_id = u_doc.id
             WHERE r.patient_id = ?
             ORDER BY r.created_at DESC`,
            [patientId]
        );

        res.json({
            status: 'success',
            data: reports
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update report status
const updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status } = req.body;

        const [result] = await pool.execute(
            'UPDATE reports SET status = ? WHERE id = ? AND lab_user_id = ?',
            [status, reportId, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Report not found or unauthorized'
            });
        }

        res.json({
            status: 'success',
            message: 'Report status updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = {
    uploadReport,
    getPatientReports,
    updateReportStatus
};