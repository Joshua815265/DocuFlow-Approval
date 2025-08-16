import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import Expenses from './pages/Expenses';
import Settlements from './pages/Settlements';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Placeholder routes for other pages */}
            <Route
              path="/groups"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Groups />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Expenses />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settlements"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Settlements />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                      <p className="text-gray-600 mt-2">Settings page coming soon...</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
