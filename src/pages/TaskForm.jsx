import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

export default function TaskForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addTask, updateTask, getTask } = useTasks();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
    });

    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            const task = getTask(id);
            console.log(task,id)
            if (task) {
                setFormData({
                    title: task.title,
                    description: task.description,
                    status: task.status,
                });
            }
        }
    }, [id, isEditMode, getTask]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await updateTask(id, formData);
            } else {
                console.log(formData)
                await addTask(formData);
            }
            navigate('/');
        } catch (error) {
            console.error('Failed to save task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-8">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="mb-4 text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </div>

                <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
                    <CardHeader className="space-y-1 pb-8 border-b border-purple-100 dark:border-purple-900/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                                    {isEditMode ? 'Edit Task' : 'Create New Task'}
                                </CardTitle>
                                <CardDescription className="text-base mt-1">
                                    {isEditMode ? 'Update your task details' : 'Add a new task to your list'}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Task Title <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Enter task title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="h-12 border-2 focus:border-purple-500 text-base"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="5"
                                    placeholder="Enter task description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    className="flex w-full rounded-md border-2 border-gray-300 bg-white px-3 py-3 text-base ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-purple-400 resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="status" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="flex h-12 w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-purple-400"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all text-base"
                                    isLoading={loading}
                                >
                                    <Save className="mr-2 h-5 w-5" />
                                    {isEditMode ? 'Update Task' : 'Create Task'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/')}
                                    className="h-12 border-2 border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
