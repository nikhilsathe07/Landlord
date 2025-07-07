import React from 'react';
import { Menu, Bell, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../utils/constants';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Page title - hidden on mobile */}
          <h1 className="hidden sm:block text-xl font-semibold text-gray-900">
            {t('dashboard.welcome')}, {user?.name}
          </h1>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative group">
              <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <Globe className="h-5 w-5" />
              </button>
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      i18n.language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <span className="mr-3">{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Avatar */}
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;