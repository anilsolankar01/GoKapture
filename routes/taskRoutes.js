// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

// Only Admins can create tasks for other users
router.post('/', authenticateToken, checkRole(['Admin']), taskController.createTask);

// Only Admins can delete tasks
router.delete('/:taskId', authenticateToken, checkRole(['Admin']), taskController.deleteTask);

// Users can view their own tasks, Admins can view all tasks
router.get('/', authenticateToken, checkRole(['User', 'Admin']), taskController.getTasks);

// Users can update their own tasks, Admins can update any task
router.put('/:taskId', authenticateToken, checkRole(['User', 'Admin']), taskController.updateTask);

module.exports = router;
