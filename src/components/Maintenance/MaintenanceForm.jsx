import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { ChevronLeft, ChevronRight, Upload, X, Camera, Check, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MAINTENANCE_CATEGORIES, URGENCY_LEVELS, COMMON_ISSUES } from '../../utils/constants';
import toast from 'react-hot-toast';

const MaintenanceForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addMaintenanceRequest, loading } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      category: '',
      urgency: 'medium',
      title: '',
      description: '',
      location: ''
    }
  });

  const watchedValues = watch();
  const totalSteps = 5;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 3,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast.error('Some files were rejected. Please check file size and type.');
      }
      
      const newFiles = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video'
      }));
      
      setUploadedFiles(prev => {
        const combined = [...prev, ...newFiles];
        if (combined.length > 3) {
          toast.error('Maximum 3 files allowed');
          return prev;
        }
        return combined;
      });
    }
  });

  const removeFile = (index) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(prev[index].preview);
      return newFiles;
    });
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setValue('title', suggestion);
    setValue('description', `Issue: ${suggestion}\n\nAdditional details: `);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const files = uploadedFiles.map(f => f.file);
      const result = await addMaintenanceRequest(data, files);
      
      if (result.success) {
        // Clean up object URLs
        uploadedFiles.forEach(f => URL.revokeObjectURL(f.preview));
        navigate('/tenant/dashboard');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return watchedValues.category;
      case 2: return watchedValues.urgency;
      case 3: return watchedValues.title && watchedValues.description;
      case 4: return true; // Photos are optional
      case 5: return true; // Review step
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Issue Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MAINTENANCE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setValue('category', category.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                    watchedValues.category === category.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-white text-xl`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.label}</h3>
                      <p className="text-sm text-gray-600">Issues related to {category.label.toLowerCase()}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Please select a category
              </p>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How urgent is this issue?</h2>
            <div className="space-y-4">
              {URGENCY_LEVELS.map((level) => (
                <label
                  key={level.id}
                  className={`flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    watchedValues.urgency === level.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <input
                    type="radio"
                    value={level.id}
                    {...register('urgency', { required: 'Please select urgency level' })}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full ${level.color} mr-4`}></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{level.label} Priority</h3>
                    <p className="text-sm text-gray-600">
                      {level.id === 'high' && 'Immediate attention required - safety or security issue'}
                      {level.id === 'medium' && 'Should be addressed soon - affects daily living'}
                      {level.id === 'low' && 'Can wait for scheduled maintenance - minor inconvenience'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {errors.urgency && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.urgency.message}
              </p>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Describe the Issue</h2>
            
            {/* Common Issues Suggestions */}
            {watchedValues.category && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Quick Suggestions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_ISSUES.filter(issue => {
                    const category = watchedValues.category;
                    if (category === 'plumbing') return issue.includes('faucet') || issue.includes('drain') || issue.includes('toilet') || issue.includes('pipe');
                    if (category === 'electrical') return issue.includes('outlet') || issue.includes('light') || issue.includes('electrical');
                    if (category === 'hvac') return issue.includes('conditioning') || issue.includes('heating');
                    return true;
                  }).slice(0, 6).map((issue) => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => handleSuggestionClick(issue)}
                      className={`p-3 text-left text-sm rounded-lg border transition-colors ${
                        selectedSuggestion === issue
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                {...register('title', { 
                  required: 'Title is required',
                  minLength: { value: 5, message: 'Title must be at least 5 characters' }
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of the issue"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 20, message: 'Description must be at least 20 characters' }
                })}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Please provide detailed information about the issue, when it started, and any relevant context..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Location (Optional)
              </label>
              <input
                type="text"
                {...register('location')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Kitchen sink, Master bedroom bathroom, Living room ceiling..."
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Add Photos or Videos</h2>
            <p className="text-gray-600">Visual documentation helps us understand the issue better and respond faster. (Maximum 3 files, 10MB each)</p>

            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop files here' : 'Upload Photos or Videos'}
              </h3>
              <p className="text-gray-600">
                Drag & drop files here, or click to select files
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports images and videos up to 10MB each (max 3 files)
              </p>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Uploaded Files ({uploadedFiles.length}/3)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {uploadedFiles.map((fileObj, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {fileObj.type === 'image' ? (
                          <img
                            src={fileObj.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={fileObj.preview}
                            className="w-full h-full object-cover"
                            controls
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{fileObj.file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Review Your Request</h2>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Category</h3>
                <p className="text-gray-600 capitalize">{watchedValues.category}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Urgency</h3>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  watchedValues.urgency === 'high' ? 'bg-red-100 text-red-800' :
                  watchedValues.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {watchedValues.urgency} Priority
                </span>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Title</h3>
                <p className="text-gray-600">{watchedValues.title}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{watchedValues.description}</p>
              </div>
              
              {watchedValues.location && (
                <div>
                  <h3 className="font-medium text-gray-900">Location</h3>
                  <p className="text-gray-600">{watchedValues.location}</p>
                </div>
              )}
              
              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900">Attachments</h3>
                  <p className="text-gray-600">{uploadedFiles.length} file(s) uploaded</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Your request will be reviewed within 24 hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>You'll receive updates via notifications and chat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>A technician will be scheduled if needed</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">New Maintenance Request</h1>
            <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                {isSubmitting || loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                {isSubmitting || loading ? 'Submitting...' : 'Submit Request'}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MaintenanceForm;