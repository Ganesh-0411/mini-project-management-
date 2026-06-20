import React, { useState, useEffect } from 'react';
import { getTasks, updateTaskStatus, deleteTask, getTaskStats } from '../services/api';
import TaskCard from '../components/TaskCard';
import { Loader2, Search, Filter, ArrowDownUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Controls
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [taskData, statsData] = await Promise.all([
        getTasks({ page, limit: 8, search: searchQuery, status: filter, sortBy, order }),
        getTaskStats()
      ]);
      setTasks(taskData.tasks);
      setTotalPages(taskData.totalPages);
      setStats(statsData);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch tasks. Please ensure the backend server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Delay search to avoid too many requests
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, filter, searchQuery, sortBy, order]);

  const handleComplete = async (id) => {
    try {
      await updateTaskStatus(id, 'Completed');
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        fetchDashboardData();
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
      </div>
    );
  }

  return (
    <div>
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Tasks</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 py-2 px-3 border"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm py-2 px-3 border"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
              className="p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
              title="Sort Date"
            >
              <ArrowDownUp size={18} />
            </button>
          </div>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id || task._id} 
            task={task} 
            onComplete={handleComplete} 
            onDelete={handleDelete} 
          />
        ))}
      </div>

      {tasks.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">No tasks found.</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border dark:border-gray-600 disabled:opacity-50 dark:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border dark:border-gray-600 disabled:opacity-50 dark:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
