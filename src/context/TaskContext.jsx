import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const TaskContext = createContext();
const  API_URL = import.meta.env.VITE_API_URL;

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalTasks: 0,
        limit: 6,
    });
    const { token } = useAuth();

    const fetchTasks = useCallback(async (page = 1, limit = 6) => {
        if (!token) {
            setTasks([]);
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/tasks/?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();

                // Handle different response formats
                if (data.tasks && Array.isArray(data.tasks)) {
                    // Paginated response with metadata
                    setTasks(data.tasks);
                    setPagination({
                        currentPage: data.currentPage || page,
                        totalPages: data.totalPages || 1,
                        totalTasks: data.totalTasks || data.tasks.length,
                        limit: data.limit || limit,
                    });
                } else if (Array.isArray(data)) {
                    // Simple array response (fallback for non-paginated API)
                    setTasks(data);
                    setPagination({
                        currentPage: 1,
                        totalPages: 1,
                        totalTasks: data.length,
                        limit: data.length,
                    });
                } else {
                    setTasks([]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const addTask = async (task) => {
        try {
            const response = await fetch(`${API_URL}/api/tasks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(task),
            });
            if (response.ok) {
                const newTask = await response.json();
                // Refresh tasks to get updated pagination
                await fetchTasks(pagination.currentPage, pagination.limit);
                return newTask;
            }
        } catch (error) {
            console.error('Failed to add task:', error);
            throw error;
        }
    };

    const updateTask = async (id, updatedTask) => {
        try {
            const response = await fetch(`${API_URL}/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedTask),
            });
            if (response.ok) {
                const data = await response.json();
                setTasks((prev) =>
                    prev.map((task) => (task._id === id || task.id === id ? data : task))
                );
                return data;
            }
        } catch (error) {
            console.error('Failed to update task:', error);
            throw error;
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                // Refresh tasks to get updated pagination
                await fetchTasks(pagination.currentPage, pagination.limit);
            }
        } catch (error) {
            console.error('Failed to delete task:', error);
            throw error;
        }
    };

    const getTask = (id) => {
        return tasks.find((task) => task._id === id || task.id === id);
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, getTask, loading, fetchTasks, pagination }}>
            {!loading && children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};
