import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Search, Clock, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getStatusColor, getCategoryIcon } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';

const MaintenanceHistory = () => {
  const { maintenanceRequests } = useApp();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Filter requests based on user role
  const userRequests = user?.role === 'tenant' 
    ? maintenanceRequests.filter(req => req.tenantId === user.id)
    : maintenanceRequests;

  // Apply filters
  const filteredRequests = userRequests
    .filter(req => filterStatus === 'all' || req.status === filterStatus)
    .filter(req => filterCategory === 'all' || req.category === filterCategory)
    .filter(req => 
      searchTerm === '' || 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));

  const stats = {
    total: userRequests.length,
    pending: userRequests.filter(req => req.status === 'pending').length,
    inProgress: userRequests.filter(req => req.status === 'in-progress').length,
    completed: userRequests.filter(req => req.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Maintenance History</h1>
        <p className="text-indigo-100">
          {user?.role === 'tenant' ? 'Your maintenance request history' : 'All property maintenance requests'}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
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
              <AlertTriangle className="h-5 w-5 text-blue-600" />
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
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="general">General</option>
              <option value="appliances">Appliances</option>
              <option value="hvac">HVAC</option>
              <option value="cleaning">Cleaning</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/70 backdrop-blur-md rounded-xl border border-white/20"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredRequests.length} Request{filteredRequests.length !== 1 ? 's' : ''}
          </h2>
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
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{request.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📅 {formatDate(request.dateSubmitted)}</span>
                        <span className="capitalize">📂 {request.category}</span>
                        {user?.role === 'landlord' && (
                          <span>🏠 Unit 4B</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status, 'maintenance')}`}>
                      {request.status}
                    </span>
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No requests found</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Title</h3>
                <p className="text-gray-600">{selectedRequest.title}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Description</h3>
                <p className="text-gray-600">{selectedRequest.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Category</h3>
                  <p className="text-gray-600 capitalize">{selectedRequest.category}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Urgency</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedRequest.urgency === 'high' ? 'bg-red-100 text-red-800' :
                    selectedRequest.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedRequest.urgency}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Status</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status, 'maintenance')}`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Submitted</h3>
                  <p className="text-gray-600">{formatDate(selectedRequest.dateSubmitted)}</p>
                </div>
              </div>
              
              {selectedRequest.images && selectedRequest.images.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Attachments</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRequest.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceHistory;