const { Task, User } = require('../models');
const { Op } = require('sequelize');

const createTask = async (req, res) => {
    const { title, description, status, priority, due_date, userId } = req.body;
    try {
        // Admins can specify the userId, others will use their own ID
        const assignedUserId = req.user.role === 'Admin' ? userId : req.user.id;
        const task = await Task.create({ title, description, status, priority, due_date, userId: assignedUserId });
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTasks = async (req, res) => {
    const { status, priority, due_date, search } = req.query;
    const whereClause = { userId: req.user.role === 'Admin' ? { [Op.ne]: null } : req.user.id };

    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (due_date) whereClause.due_date = due_date;
    if (search) whereClause.title = { [Op.like]: `%${search}%` };

    try {
        const tasks = await Task.findAll({ where: whereClause });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTask = async (req, res) => {
    const { taskId } = req.params;
    try {
        // Check if the task exists
        const task = await Task.findOne({ where: { id: taskId } });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Admins can update any task, users can only update their own tasks
        if (req.user.role !== 'Admin' && task.userId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await task.update(req.body);
        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    try {
        const task = await Task.findOne({ where: { id: taskId } });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Admins can delete any task, users can only delete their own tasks
        if (req.user.role !== 'Admin' && task.userId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await task.destroy();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
