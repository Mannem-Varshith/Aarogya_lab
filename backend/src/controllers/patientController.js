const { pool } = require('../config/database');

// Search patients
const searchPatients = async (req, res) => {
    try {
        const { query } = req.query;
        const searchQuery = `%${query}%`;

        const [patients] = await pool.execute(
            `SELECT 
                p.id,
                u.name,
                u.email,
                u.phone,
                p.age,
                p.gender,
                p.created_at
            FROM patients p
            JOIN users u ON p.user_id = u.id
            WHERE u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?
            ORDER BY u.name ASC`,
            [searchQuery, searchQuery, searchQuery]
        );

        res.json({
            status: 'success',
            data: patients
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get patient details
const getPatientDetails = async (req, res) => {
    try {
        const { patientId } = req.params;

        const [patients] = await pool.execute(
            `SELECT 
                p.id,
                u.name,
                u.email,
                u.phone,
                p.age,
                p.gender,
                p.created_at,
                (
                    SELECT COUNT(*)
                    FROM reports r
                    WHERE r.patient_id = p.id
                ) as total_reports,
                (
                    SELECT COUNT(*)
                    FROM reports r
                    WHERE r.patient_id = p.id
                    AND r.status = 'pending'
                ) as pending_reports
            FROM patients p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ?`,
            [patientId]
        );

        if (patients.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Patient not found'
            });
        }

        // Get recent reports
        const [recentReports] = await pool.execute(
            `SELECT 
                r.*,
                d.specialization as doctor_specialization,
                u.name as doctor_name
            FROM reports r
            LEFT JOIN doctors d ON r.doctor_id = d.id
            LEFT JOIN users u ON d.user_id = u.id
            WHERE r.patient_id = ?
            ORDER BY r.created_at DESC
            LIMIT 5`,
            [patientId]
        );

        const patient = patients[0];
        patient.recentReports = recentReports;

        res.json({
            status: 'success',
            data: patient
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update patient details
const updatePatientDetails = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { patientId } = req.params;
        const { name, email, phone, age, gender } = req.body;

        // Update user table
        const [userResult] = await connection.execute(
            `UPDATE users u
             JOIN patients p ON u.id = p.user_id
             SET u.name = ?, u.email = ?, u.phone = ?
             WHERE p.id = ?`,
            [name, email, phone, patientId]
        );

        // Update patient table
        const [patientResult] = await connection.execute(
            'UPDATE patients SET age = ?, gender = ? WHERE id = ?',
            [age, gender, patientId]
        );

        if (userResult.affectedRows === 0 || patientResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({
                status: 'error',
                message: 'Patient not found'
            });
        }

        await connection.commit();

        res.json({
            status: 'success',
            message: 'Patient details updated successfully'
        });
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

module.exports = {
    searchPatients,
    getPatientDetails,
    updatePatientDetails
};