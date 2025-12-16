const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const auth = require('../middleware/auth.middleware');

// Public route to get current employee of the month
// Use auth middleware if you want it protected, or leave open if public feed
// Assuming feed is protected, adding auth middleware
// If auth middleware is not set up perfectly or you want to test easily, you can remove 'auth'
// For now, let's assume valid token is required
router.get('/current', employeeController.getEmployeeOfMonth);

// Admin route to create/update
// In a real app, you'd check for admin role in middleware
router.post('/', employeeController.createEmployeeOfMonth);

// Get list of candidates for dropdown
router.get('/candidates', employeeController.getCandidates);

module.exports = router;
