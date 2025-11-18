const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    uploadReport,
    getPatientReports,
    updateReportStatus
} = require('../controllers/reportController');

// Upload report (lab users only)
router.post(
    '/upload',
    verifyToken,
    checkRole(['lab']),
    upload.single('report'),
    uploadReport
);

// Get patient reports (accessible by doctors and the patient themselves)
router.get(
    '/patient/:patientId',
    verifyToken,
    checkRole(['doctor', 'patient']),
    getPatientReports
);

// Update report status (lab users only)
router.patch(
    '/:reportId/status',
    verifyToken,
    checkRole(['lab']),
    updateReportStatus
);

module.exports = router;