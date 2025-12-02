import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { format } from 'date-fns';
import { Pencil, Trash2, CheckCircle, Circle, Plus, Sparkles, LayoutGrid, LayoutList } from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/Modal';
import TaskDetailModal from '../components/TaskDetailModal';

export default function Dashboard() {
    const { tasks, deleteTask, updateTask, fetchTasks, pagination } = useTasks();
    const { user } = useAuth();
    const [deleteId, setDeleteId] = useState(null);
    const [deletingTaskId, setDeletingTaskId] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [newlyCreatedTaskIds, setNewlyCreatedTaskIds] = useState(new Set());
    const [selectedTask, setSelectedTask] = useState(null);


    // Track newly created tasks
    React.useEffect(() => {
        if (tasks.length > 0) {
            const latestTask = tasks[0];
            const taskId = latestTask._id || latestTask.id;

            // Check if this is a new task (created in last 2 seconds)
            const taskAge = Date.now() - new Date(latestTask.createdAt).getTime();
            if (taskAge < 2000 && !newlyCreatedTaskIds.has(taskId)) {
                setNewlyCreatedTaskIds(prev => new Set([...prev, taskId]));
                // Remove from set after animation completes
                setTimeout(() => {
                    setNewlyCreatedTaskIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(taskId);
                        return newSet;
                    });
                }, 600);
            }
        }
    }, [tasks]);

    const handleDelete = () => {
        if (deleteId) {
            setDeletingTaskId(deleteId);
            // Wait for animation to complete before actually deleting
            setTimeout(() => {
                deleteTask(deleteId);
                setDeleteId(null);
                setDeletingTaskId(null);
            }, 400);
        }
    };

    const toggleStatus = (task) => {
        const taskId = task._id || task.id;
        updateTask(taskId, {
            status: task.status === 'Completed' ? 'Pending' : 'Completed'
        });
    };

    const handlePageChange = (newPage) => {
        fetchTasks(newPage, pagination.limit);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400 flex items-center gap-3">
                            <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            Dashboard
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your tasks efficiently</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* View Mode Toggle - Hidden on mobile */}
                        <div className="hidden md:flex items-center gap-1 p-1 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "transition-all",
                                    viewMode === 'list'
                                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                                        : "text-gray-600 dark:text-gray-400 hover:text-purple-600"
                                )}
                            >
                                <LayoutList className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "transition-all",
                                    viewMode === 'grid'
                                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                                        : "text-gray-600 dark:text-gray-400 hover:text-purple-600"
                                )}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                        </div>
                        <Link to="/add-task">
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                                <Plus className="mr-2 h-5 w-5" />
                                Add Task
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className={cn(
                    "gap-6",
                    viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid"
                )}>
                    {tasks.length === 0 ? (
                        <Card className="border-2 border-dashed border-purple-300 dark:border-purple-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <Sparkles className="h-16 w-16 text-purple-400 mb-4" />
                                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No tasks yet!</p>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first task to get started</p>
                                <Link to="/add-task">
                                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create your first task
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        tasks.map((task) => {
                            const taskId = task._id || task.id;
                            const gradientClass = task.status === 'Completed'
                                ? 'from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10'
                                : 'from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10';
                            const isDeleting = deletingTaskId === taskId;
                            const isNewlyCreated = newlyCreatedTaskIds.has(taskId);

                            return (
                                <Card
                                    key={taskId}
                                    onClick={() => setSelectedTask(task)}
                                    className={cn(
                                        "transition-all hover:shadow-2xl hover:scale-[1.02] border-l-4 bg-gradient-to-br backdrop-blur-sm cursor-pointer",
                                        task.status === 'Completed' ? 'border-l-green-500' : 'border-l-purple-500',
                                        gradientClass,
                                        isDeleting && 'task-deleting',
                                        isNewlyCreated ? 'task-creating' : 'task-enter'
                                    )}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                                            <div className="space-y-1 flex-1 w-full min-w-0">
                                                <CardTitle className={cn("text-xl sm:text-2xl font-bold break-words overflow-wrap-anywhere", task.status === 'Completed' && "text-gray-500 line-through")}>
                                                    {task.title}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
                                                    <span className="inline-flex items-center gap-1">
                                                        📅 {format(new Date(task.createdAt), 'PPP')}
                                                    </span>
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleStatus(task)}
                                                    title={task.status === 'Completed' ? "Mark as Pending" : "Mark as Completed"}
                                                    className="hover:scale-110 transition-transform h-8 w-8 sm:h-10 sm:w-10"
                                                >
                                                    {task.status === 'Completed' ? (
                                                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                                                    ) : (
                                                        <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                                                    )}
                                                </Button>
                                                <Link to={`/edit-task/${taskId}`}>
                                                    <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform hover:bg-blue-100 dark:hover:bg-blue-900/30 h-8 w-8 sm:h-10 sm:w-10">
                                                        <Pencil className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                                                    </Button>
                                                </Link>
                                                {user?.role === 'admin' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:scale-110 transition-transform hover:bg-red-100 dark:hover:bg-red-900/30 h-8 w-8 sm:h-10 sm:w-10"
                                                        onClick={() => setDeleteId(taskId)}
                                                    >
                                                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className={cn("text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4 break-words overflow-wrap-anywhere", task.status === 'Completed' && "text-gray-500")}>
                                            {task.description}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold shadow-sm",
                                                task.status === 'Completed'
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                                    : "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
                                            )}>
                                                {task.status === 'Completed' ? '✓ ' : '⏳ '}{task.status}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>


                {pagination.totalPages > 0 && (
                    <div className="flex justify-center items-center gap-4 mt-8 p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm shadow-lg">
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                        >
                            ← Previous
                        </Button>
                        <span className="flex items-center px-6 py-2 text-sm font-semibold bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full text-purple-700 dark:text-purple-300">
                            Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalTasks} tasks
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                        >
                            Next →
                        </Button>
                    </div>
                )}

                <Modal
                    isOpen={!!deleteId}
                    onClose={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                    title="Delete Task"
                    description="Are you sure you want to delete this task? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                />

                <TaskDetailModal
                    task={selectedTask}
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onToggleStatus={toggleStatus}
                    onDelete={setDeleteId}
                    isAdmin={user?.role === 'admin'}
                />
            </div>
        </div>
    );
}
