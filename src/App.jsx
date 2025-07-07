import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import TenantDashboard from './components/Dashboard/TenantDashboard';
import LandlordDashboard from './components/Dashboard/LandlordDashboard';
import MaintenanceForm from './components/Maintenance/MaintenanceForm';
import MaintenanceHistory from './components/Maintenance/MaintenanceHistory';
import ChatWindow from './components/Chat/ChatWindow';
import RentTracker from './components/Rent/RentTracker';
import Profile from './components/Auth/Profile';
import MaintenanceScheduling from './components/Maintenance/MaintenanceScheduling';
import { motion } from 'framer-motion';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route 
          path="/" 
          element={
            <Navigate to={user.role === 'tenant' ? '/tenant/dashboard' : '/landlord/dashboard'} replace />
          } 
        />
        <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        <Route path="/tenant/request" element={<MaintenanceForm />} />
        <Route path="/tenant/history" element={<MaintenanceHistory />} />
        <Route path="/tenant/rent" element={<RentTracker />} />
        <Route path="/tenant/schedule/:requestId" element={<MaintenanceScheduling />} />
        <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
        <Route path="/landlord/history" element={<MaintenanceHistory />} />
        <Route path="/chat" element={<ChatWindow />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
}

export default App;