import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import MainLayout from './layouts/MainLayout';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <Router>
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="add-task" element={<TaskForm />} />
                <Route path="edit-task/:id" element={<TaskForm />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
