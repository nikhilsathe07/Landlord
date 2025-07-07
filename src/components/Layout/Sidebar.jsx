import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Wrench, 
  History, 
  MessageCircle, 
  CreditCard, 
  User, 
  LogOut,
  X,
  Calendar,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tenantNavItems = [
    { to: '/tenant/dashboard', icon: Home, label: t('nav.dashboard') },
    { to: '/tenant/request', icon: Wrench, label: t('nav.maintenance') },
    { to: '/tenant/history', icon: History, label: t('nav.history') },
    { to: '/chat', icon: MessageCircle, label: t('nav.chat') },
    { to: '/tenant/rent', icon: CreditCard, label: t('nav.rent') },
    { to: '/profile', icon: User, label: t('nav.profile') }
  ];

  const landlordNavItems = [
    { to: '/landlord/dashboard', icon: Home, label: t('nav.dashboard') },
    { to: '/landlord/history', icon: History, label: 'All Requests' },
    { to: '/chat', icon: MessageCircle, label: t('nav.chat') },
    { to: '/profile', icon: Settings, label: 'Properties' }
  ];

  const navItems = user?.role === 'tenant' ? tenantNavItems : landlordNavItems;

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="flex flex-col h-full bg-white/80 backdrop-blur-md border-r border-white/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="ml-3 text-lg font-semibold text-gray-900">PropertyCare</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          {t('nav.logout')}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;