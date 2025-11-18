const { pool } = require('../config/database');

// Get dashboard statistics based on user role
const getDashboardStats = async (req, res) => {
    try {
        const { role, id } = req.user;
        let stats = {};

        switch (role) {
            case 'lab':
                // Get lab stats
                const [labStats] = await pool.execute(
                    `SELECT
                        COUNT(*) as total_reports,
                        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_reports,
                        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_reports,
                        SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent_reports,
                        COUNT(DISTINCT patient_id) as total_patients
                    FROM reports
                    WHERE lab_user_id = ?`,
                    [id]
                );

                // Get recent activities
                const [labActivities] = await pool.execute(
                    `SELECT 
                        r.*,
                        u.name as patient_name
                    FROM reports r
                    JOIN patients p ON r.patient_id = p.id
                    JOIN users u ON p.user_id = u.id
                    WHERE r.lab_user_id = ?
                    ORDER BY r.created_at DESC
                    LIMIT 5`,
                    [id]
                );

                stats = {
                    ...labStats[0],
                    recentActivities: labActivities
                };
                break;

            case 'doctor':
                // Get doctor stats
                const [doctorStats] = await pool.execute(
                    `SELECT
                        COUNT(DISTINCT r.patient_id) as total_patients,
                        COUNT(r.id) as total_reports,
                        SUM(CASE WHEN r.status = 'pending' THEN 1 ELSE 0 END) as pending_reports
                    FROM doctors d
                    LEFT JOIN reports r ON d.id = r.doctor_id
                    WHERE d.user_id = ?`,
                    [id]
                );

                // Get recent patients
                const [recentPatients] = await pool.execute(
                    `SELECT DISTINCT
                        p.id,
                        u.name,
                        u.phone,
                        p.age,
                        p.gender,
                        r.created_at as last_report_date
                    FROM doctors d
                    JOIN reports r ON d.id = r.doctor_id
                    JOIN patients p ON r.patient_id = p.id
                    JOIN users u ON p.user_id = u.id
                    WHERE d.user_id = ?
                    ORDER BY r.created_at DESC
                    LIMIT 5`,
                    [id]
                );

                stats = {
                    ...doctorStats[0],
                    recentPatients
                };
                break;

            case 'patient':
                // Get patient stats
                const [patientStats] = await pool.execute(
                    `SELECT
                        COUNT(*) as total_reports,
                        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_reports,
                        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_reports,
                        COUNT(DISTINCT doctor_id) as total_doctors
                    FROM reports r
                    JOIN patients p ON r.patient_id = p.id
                    WHERE p.user_id = ?`,
                    [id]
                );

                // Get recent reports
                const [recentReports] = await pool.execute(
                    `SELECT 
                        r.*,
                        u.name as doctor_name,
                        d.specialization as doctor_specialization
                    FROM reports r
                    JOIN patients p ON r.patient_id = p.id
                    LEFT JOIN doctors d ON r.doctor_id = d.id
                    LEFT JOIN users u ON d.user_id = u.id
                    WHERE p.user_id = ?
                    ORDER BY r.created_at DESC
                    LIMIT 5`,
                    [id]
                );

                stats = {
                    ...patientStats[0],
                    recentReports
                };
                break;
        }

        res.json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};