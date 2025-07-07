import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, AlertCircle, CheckCircle, Clock, DollarSign, Download, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

const RentTracker = () => {
  const { rentPayments, updateRentPayment } = useApp();
  const { user } = useAuth();
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Filter payments for current user and year
  const userPayments = rentPayments
    .filter(payment => payment.tenantId === user?.id)
    .filter(payment => {
      const paymentDate = new Date(payment.dueDate);
      return paymentDate.getFullYear() === filterYear;
    })
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

  const stats = {
    totalPaid: userPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    totalPending: userPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    totalOverdue: userPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
    onTimePayments: userPayments.filter(p => 
      p.status === 'paid' && 
      p.paidDate && 
      new Date(p.paidDate) <= new Date(p.dueDate)
    ).length
  };

  const handleMarkAsPaid = async (paymentId) => {
    const result = await updateRentPayment(paymentId, {
      status: 'paid',
      paidDate: new Date().toISOString()
    });
    
    if (result.success) {
      setShowPaymentModal(false);
    }
  };

  const handleRequestDelay = async (paymentId) => {
    // In a real app, this would send a request to the landlord
    toast.success('Delay request sent to landlord');
    setShowPaymentModal(false);
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'overdue': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getMonthName = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const exportPayments = () => {
    const csvContent = [
      ['Month', 'Due Date', 'Amount', 'Status', 'Paid Date'],
      ...userPayments.map(payment => [
        getMonthName(payment.dueDate),
        formatDate(payment.dueDate),
        payment.amount,
        payment.status,
        payment.paidDate ? formatDate(payment.paidDate) : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rent-payments-${filterYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Payment history exported!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Rent Payment Tracker</h1>
        <p className="text-green-100">Track your rent payments and payment history</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPaid)}</p>
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
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPending)}</p>
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
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalOverdue)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On-Time</p>
              <p className="text-2xl font-bold text-gray-900">{stats.onTimePayments}</p>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>
          
          <button 
            onClick={exportPayments}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/70 backdrop-blur-md rounded-xl border border-white/20"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment History - {filterYear}</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {userPayments.length > 0 ? (
            userPayments.map((payment) => (
              <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getPaymentStatusIcon(payment.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Rent - {getMonthName(payment.dueDate)}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Due: {formatDate(payment.dueDate)}</span>
                        {payment.paidDate && (
                          <span>Paid: {formatDate(payment.paidDate)}</span>
                        )}
                        <span className="font-medium">{formatCurrency(payment.amount)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status, 'payment')}`}>
                      {payment.status}
                    </span>
                    
                    {payment.status !== 'paid' && (
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentModal(true);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Actions
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No payment records found for {filterYear}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Payment Action Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Payment Actions - {getMonthName(selectedPayment.dueDate)}
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Amount Due:</span>
                  <span className="font-semibold">{formatCurrency(selectedPayment.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Due Date:</span>
                  <span className="text-sm">{formatDate(selectedPayment.dueDate)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleMarkAsPaid(selectedPayment.id)}
                  className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Mark as Paid</span>
                </button>
                
                <button
                  onClick={() => handleRequestDelay(selectedPayment.id)}
                  className="w-full py-3 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Clock className="h-5 w-5" />
                  <span>Request Payment Delay</span>
                </button>
                
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-3 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RentTracker;