const Task = require('../models/Task');

// @desc    Get all tasks with pagination, search, sorting
// @route   GET /tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query
        const query = { user: req.user.id };

        // Search
        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Filter by status if provided
        if (req.query.status && req.query.status !== 'All') {
            query.status = req.query.status;
        }

        // Sorting
        const sortObj = {};
        if (req.query.sortBy === 'created_at') {
            sortObj.created_at = req.query.order === 'asc' ? 1 : -1;
        } else {
            sortObj.created_at = -1; // Default
        }

        const tasks = await Task.find(query).sort(sortObj).skip(skip).limit(limit);
        const total = await Task.countDocuments(query);

        res.status(200).json({
            tasks,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a task
// @route   POST /tasks
// @access  Public
const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }
        
        if (description.length < 20) {
            return res.status(400).json({ message: 'Description must be at least 20 characters' });
        }

        const task = new Task({
            title,
            description,
            status: status || 'Pending',
            user: req.user.id
        });

        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(400).json({ message: 'Invalid task data', error: error.message });
    }
};

// @desc    Update task status
// @route   PUT /tasks/:id
// @access  Public
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check user
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        task.status = status;
        const updatedTask = await task.save();
        
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: 'Error updating task', error: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check user
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task removed' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting task', error: error.message });
    }
};

// @desc    Get task stats
// @route   GET /tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
    try {
        const total = await Task.countDocuments({ user: req.user.id });
        const pending = await Task.countDocuments({ user: req.user.id, status: 'Pending' });
        const completed = await Task.countDocuments({ user: req.user.id, status: 'Completed' });
        const inProgress = await Task.countDocuments({ user: req.user.id, status: 'In Progress' });

        res.status(200).json({
            total,
            pending,
            completed,
            inProgress
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    getTaskStats
};
