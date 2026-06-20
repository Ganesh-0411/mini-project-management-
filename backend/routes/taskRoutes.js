const express = require('express');
const router = express.Router();
const {
    getTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getTaskStats);

router.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);

router.route('/:id')
    .put(protect, updateTaskStatus)
    .delete(protect, deleteTask);

module.exports = router;
