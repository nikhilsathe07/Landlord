import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Wrench, Clock, CheckCircle, AlertCircle, MessageCircle, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';

const TenantDashboard = () => {
  const { maintenanceRequests, rentPayments, messages } = useApp();
  const { user } = useAuth();
  const { t } = useTranslation();

  const userRequests = maintenanceRequests.filter(req => req.tenantId === user?.id);
  const recentRequests = userRequests.slice(0, 3);
  
  const stats = {
    pending: userRequests.filter(req => req.status === 'pending').length,
    inProgress: userRequests.filter(req => req.status === 'in-progress').length,
    completed: userRequests.filter(req => req.status === 'completed').length
  };

  const unreadMessages = messages.filter(msg => msg.receiverId === user?.id && !msg.read).length;
  const overdueBills = rentPayments.filter(payment => 
    payment.status === 'overdue' && payment.tenantId === user?.id
  ).length;

  const quickActions = [
    {
      title: 'New Request',
      description: 'Submit maintenance request',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      to: '/tenant/request'
    },
    {
      title: 'View History',
      description: 'See all requests',
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      to: '/tenant/history'
    },
    {
      title: 'Chat',
      description: 'Message landlord',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      to: '/chat',
      badge: unreadMessages
    },
    {
      title: 'Rent',
      description: 'View payments',
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      to: '/tenant/rent',
      badge: overdueBills
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">{t('dashboard.welcome')}, {user?.name}!</h1>
        <p className="text-blue-100">Here's what's happening with your property today</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={action.title}
              to={action.to}
              className="group relative bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:shadow-lg transition-all duration-200"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600">{action.description}</p>
              {action.badge > 0 && (
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {action.badge}
                </div>
              )}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/70 backdrop-blur-md rounded-xl border border-white/20"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Requests</h2>
            <Link
              to="/tenant/history"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="p-6">
          {recentRequests.length > 0 ? (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      request.urgency === 'high' ? 'bg-red-100' :
                      request.urgency === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <AlertCircle className={`h-5 w-5 ${
                        request.urgency === 'high' ? 'text-red-600' :
                        request.urgency === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{request.title}</p>
                      <p className="text-sm text-gray-600">{formatDate(request.dateSubmitted)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status, 'maintenance')}`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No maintenance requests yet</p>
              <Link
                to="/tenant/request"
                className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
              >
                Submit your first request
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TenantDashboard;