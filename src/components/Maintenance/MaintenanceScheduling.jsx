import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { TIME_SLOTS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const MaintenanceScheduling = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { maintenanceRequests, updateMaintenanceRequest } = useApp();
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [preferredTechnician, setPreferredTechnician] = useState('');

  const request = maintenanceRequests.find(req => req.id === requestId);

  if (!request) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Request not found</p>
      </div>
    );
  }

  const technicians = [
    { id: 'tech-1', name: 'Mike Johnson', specialty: 'Plumbing', rating: 4.8 },
    { id: 'tech-2', name: 'Sarah Wilson', specialty: 'Electrical', rating: 4.9 },
    { id: 'tech-3', name: 'David Brown', specialty: 'General', rating: 4.7 },
    { id: 'tech-4', name: 'Lisa Garcia', specialty: 'HVAC', rating: 4.8 }
  ];

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    
    updateMaintenanceRequest(requestId, {
      scheduledDate: scheduledDateTime.toISOString(),
      status: 'scheduled',
      assignedTechnician: preferredTechnician,
      schedulingNotes: notes
    });

    toast.success('Maintenance visit scheduled successfully!');
    navigate('/tenant/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold mb-2">Schedule Maintenance Visit</h1>
          <p className="text-blue-100">Choose your preferred date and time</p>
        </div>

        {/* Request Summary */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900 mb-2">Request Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Title:</span>
              <span className="font-medium">{request.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium capitalize">{request.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Urgency:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {request.urgency}
              </span>
            </div>
          </div>
        </div>

        {/* Scheduling Form */}
        <form onSubmit={handleSchedule} className="p-6 space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Preferred Date *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Available from tomorrow up to 30 days in advance
            </p>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Preferred Time *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 text-sm rounded-lg border transition-colors ${
                    selectedTime === time
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Technician Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Preferred Technician (Optional)
            </label>
            <select
              value={preferredTechnician}
              onChange={(e) => setPreferredTechnician(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">No preference</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} - {tech.specialty} (⭐ {tech.rating})
                </option>
              ))}
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Any specific instructions or access information..."
            />
          </div>

          {/* Schedule Summary */}
          {selectedDate && selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 rounded-lg p-4"
            >
              <h3 className="font-medium text-blue-900 mb-2">Scheduling Summary</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p>📅 Date: {formatDate(selectedDate)}</p>
                <p>🕐 Time: {selectedTime}</p>
                {preferredTechnician && (
                  <p>👨‍🔧 Technician: {technicians.find(t => t.id === preferredTechnician)?.name}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedDate || !selectedTime}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Schedule Visit</span>
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              You'll receive a confirmation once the schedule is approved
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MaintenanceScheduling;