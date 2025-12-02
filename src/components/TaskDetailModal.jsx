import React from 'react';
import { format } from 'date-fns';
import { X, Calendar, CheckCircle, Circle, Edit, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function TaskDetailModal({ task, isOpen, onClose, onToggleStatus, onDelete, isAdmin }) {
    if (!isOpen || !task) return null;

    const taskId = task._id || task.id;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-start justify-between p-6 border-b border-purple-100 dark:border-purple-900/30 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm">
                    <div className="flex-1 pr-4">
                        <h2 className={cn(
                            "text-2xl sm:text-3xl font-bold break-words",
                            task.status === 'Completed'
                                ? "text-gray-500 line-through"
                                : "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400"
                        )}>
                            {task.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold shadow-md",
                            task.status === 'Completed'
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                : "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
                        )}>
                            {task.status === 'Completed' ? (
                                <CheckCircle className="h-4 w-4 mr-2" />
                            ) : (
                                <Circle className="h-4 w-4 mr-2" />
                            )}
                            {task.status}
                        </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm">
                            Created on {format(new Date(task.createdAt), 'PPPP')}
                        </span>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Description</h3>
                        <p className={cn(
                            "text-base leading-relaxed whitespace-pre-wrap break-words p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50",
                            task.status === 'Completed'
                                ? "text-gray-500"
                                : "text-gray-700 dark:text-gray-300"
                        )}>
                            {task.description}
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm rounded-b-2xl">
                    <Button
                        onClick={() => {
                            onToggleStatus(task);
                            onClose();
                        }}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                    >
                        {task.status === 'Completed' ? (
                            <>
                                <Circle className="mr-2 h-5 w-5" />
                                Mark as Pending
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Mark as Completed
                            </>
                        )}
                    </Button>
                    <Link to={`/edit-task/${taskId}`} className="flex-1">
                        <Button
                            variant="outline"
                            className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        >
                            <Edit className="mr-2 h-5 w-5" />
                            Edit Task
                        </Button>
                    </Link>
                    {isAdmin && (
                        <Button
                            onClick={() => {
                                onDelete(taskId);
                                onClose();
                            }}
                            variant="outline"
                            className="border-2 border-red-500 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                            <Trash2 className="mr-2 h-5 w-5" />
                            Delete
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
