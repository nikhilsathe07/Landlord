import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Wrench, MessageCircle, CreditCard, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const MobileNav = () => {
  const { user } = useAuth();
  const { messages } = useApp();

  // Count unread messages
  const unreadCount = messages.filter(msg => 
    msg.receiverId === user?.id && !msg.read
  ).length;

  const tenantNavItems = [
    { to: '/tenant/dashboard', icon: Home, label: 'Home' },
    { to: '/tenant/request', icon: Wrench, label: 'Request' },
    { to: '/chat', icon: MessageCircle, label: 'Chat', badge: unreadCount },
    { to: '/tenant/rent', icon: CreditCard, label: 'Rent' },
    { to: '/profile', icon: User, label: 'Profile' }
  ];

  const landlordNavItems = [
    { to: '/landlord/dashboard', icon: Home, label: 'Home' },
    { to: '/chat', icon: MessageCircle, label: 'Chat', badge: unreadCount },
    { to: '/profile', icon: User, label: 'Profile' }
  ];

  const navItems = user?.role === 'tenant' ? tenantNavItems : landlordNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/20 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 relative ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            <div className="relative">
              <item.icon className="h-6 w-6" />
              {item.badge > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;