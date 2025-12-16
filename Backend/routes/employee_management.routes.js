const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth.middleware');
const controller = require('../controllers/employee_management.controller');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Profile Routes
router.get('/profile', auth, controller.getEmployeeProfile);
router.get('/profile/:id', auth, controller.getEmployeeProfileById);
router.put('/profile', auth, controller.updateEmployeeProfile);

// Document Routes
router.get('/documents', auth, controller.getDocuments);
router.post('/documents', auth, upload.single('file'), controller.uploadDocument);
router.delete('/documents/:id', auth, controller.deleteDocument);

// Directory Routes
router.get('/list', auth, controller.getAllEmployees);

module.exports = router;
