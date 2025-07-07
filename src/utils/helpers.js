import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  let date;
  
  // Handle Firebase Timestamp objects
  if (dateString && typeof dateString.toDate === 'function') {
    date = dateString.toDate();
  } else if (typeof dateString === 'string') {
    date = parseISO(dateString);
  } else if (dateString instanceof Date) {
    date = dateString;
  } else {
    return '';
  }
  
  // Validate the date
  if (isNaN(date.getTime())) {
    return '';
  }
  
  if (isToday(date)) {
    return `Today, ${format(date, 'HH:mm')}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'MMM dd, yyyy');
  }
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  let date;
  
  // Handle Firebase Timestamp objects
  if (dateString && typeof dateString.toDate === 'function') {
    date = dateString.toDate();
  } else if (typeof dateString === 'string') {
    date = parseISO(dateString);
  } else if (dateString instanceof Date) {
    date = dateString;
  } else {
    return '';
  }
  
  // Validate the date
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return formatDistanceToNow(date, { addSuffix: true });
};

export const getStatusColor = (status, type = 'maintenance') => {
  const statusMap = {
    maintenance: {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    },
    payment: {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800'
    },
    urgency: {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }
  };
  
  return statusMap[type]?.[status] || 'bg-gray-100 text-gray-800';
};

export const getCategoryIcon = (category) => {
  const icons = {
    plumbing: '🔧',
    electrical: '⚡',
    general: '🔨',
    appliances: '📱',
    hvac: '❄️',
    cleaning: '🧹'
  };
  
  return icons[category] || '🔨';
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s\-\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};