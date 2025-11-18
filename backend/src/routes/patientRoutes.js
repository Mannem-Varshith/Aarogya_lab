const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
    searchPatients,
    getPatientDetails,
    updatePatientDetails
} = require('../controllers/patientController');

// Search patients (doctors only)
router.get(
    '/search',
    verifyToken,
    checkRole(['doctor']),
    searchPatients
);

// Get patient details (doctors and the patient themselves)
router.get(
    '/:patientId',
    verifyToken,
    checkRole(['doctor', 'patient']),
    getPatientDetails
);

// Update patient details (patient themselves or admin)
router.patch(
    '/:patientId',
    verifyToken,
    checkRole(['patient']),
    updatePatientDetails
);

module.exports = router;