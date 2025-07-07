export const MAINTENANCE_CATEGORIES = [
  { id: 'plumbing', label: 'Plumbing', icon: '🔧', color: 'bg-blue-500' },
  { id: 'electrical', label: 'Electrical', icon: '⚡', color: 'bg-yellow-500' },
  { id: 'general', label: 'General', icon: '🔨', color: 'bg-gray-500' },
  { id: 'appliances', label: 'Appliances', icon: '📱', color: 'bg-purple-500' },
  { id: 'hvac', label: 'HVAC', icon: '❄️', color: 'bg-cyan-500' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹', color: 'bg-green-500' }
];

export const URGENCY_LEVELS = [
  { id: 'low', label: 'Low', color: 'bg-green-500', textColor: 'text-green-700' },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  { id: 'high', label: 'High', color: 'bg-red-500', textColor: 'text-red-700' }
];

export const REQUEST_STATUS = [
  { id: 'pending', label: 'Pending', color: 'bg-gray-500', textColor: 'text-gray-700' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-blue-500', textColor: 'text-blue-700' },
  { id: 'completed', label: 'Completed', color: 'bg-green-500', textColor: 'text-green-700' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-red-500', textColor: 'text-red-700' }
];

export const PAYMENT_STATUS = [
  { id: 'paid', label: 'Paid', color: 'bg-green-500', textColor: 'text-green-700' },
  { id: 'pending', label: 'Pending', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  { id: 'overdue', label: 'Overdue', color: 'bg-red-500', textColor: 'text-red-700' }
];

export const COMMON_ISSUES = [
  "Leaky faucet or pipe",
  "Clogged drain or toilet",
  "Electrical outlet not working",
  "Light fixture issues",
  "Air conditioning not cooling",
  "Heating not working",
  "Door won't lock properly",
  "Window won't open/close",
  "Appliance not functioning",
  "Pest control needed"
];

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];