import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Users, 
  Home, 
  TrendingUp,
  Filter,
  Search,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getStatusColor, getCategoryIcon } from '../../utils/helpers';

const LandlordDashboard = () => {
  const { maintenanceRequests, messages, updateMaintenanceRequest } = useApp();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter requests for landlord's properties
  const allRequests = maintenanceRequests.filter(req => 
    // In a real app, you'd filter by property ownership
    true
  );

  const stats = {
    total: allRequests.length,
    pending: allRequests.filter(req => req.status === 'pending').length,
    inProgress: allRequests.filter(req => req.status === 'in-progress').length,
    completed: allRequests.filter(req => req.status === 'completed').length,
    urgent: allRequests.filter(req => req.urgency === 'high').length
  };

  const unreadMessages = messages.filter(msg => 
    msg.receiverId === user?.id && !msg.read
  ).length;

  // Filter and search requests
  const filteredRequests = allRequests
    .filter(req => filterStatus === 'all' || req.status === filterStatus)
    .filter(req => 
      searchTerm === '' || 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Prioritize urgent requests
      if (a.urgency === 'high' && b.urgency !== 'high') return -1;
      if (b.urgency === 'high' && a.urgency !== 'high') return 1;
      return new Date(b.dateSubmitted) - new Date(a.dateSubmitted);
    });

  const handleStatusUpdate = (requestId, newStatus) => {
    updateMaintenanceRequest(requestId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Property Management Dashboard</h1>
        <p className="text-purple-100">Monitor and manage all maintenance requests</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">In Progress</p>
              <p className="text-xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Completed</p>
              <p className="text-xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Urgent</p>
              <p className="text-xl font-bold text-gray-900">{stats.urgent}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/20"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/70 backdrop-blur-md rounded-xl border border-white/20"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Maintenance Requests</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{getCategoryIcon(request.category)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{request.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                          request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.urgency}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{request.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📅 {formatDate(request.dateSubmitted)}</span>
                        <span>🏠 Unit 4B</span>
                        <span>👤 John Tenant</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status, 'maintenance')}`}>
                      {request.status}
                    </span>
                    
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusUpdate(request.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No requests found</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LandlordDashboard;