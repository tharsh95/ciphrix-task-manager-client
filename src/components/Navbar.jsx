import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import { LogOut, Plus, Sparkles } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <nav className="border-b border-purple-200/50 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 shadow-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white hover:scale-105 transition-transform">
                            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300" />
                            <span className="hidden xs:inline">TaskMaster</span>
                            <span className="xs:hidden">TM</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <ThemeToggle />
                        {user && (
                            <>
                                <span className="text-xs sm:text-sm font-medium text-white/90 bg-white/20 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm truncate max-w-[120px] sm:max-w-none">
                                    <span className="hidden sm:inline">Welcome, </span>{user.username}
                                </span>
                                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/20 text-xs sm:text-sm px-2 sm:px-3">
                                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Logout</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
