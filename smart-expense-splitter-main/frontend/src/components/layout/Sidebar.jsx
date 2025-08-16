import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  BanknotesIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Groups', href: '/groups', icon: UserGroupIcon },
    { name: 'Expenses', href: '/expenses', icon: BanknotesIcon },
    { name: 'Settlements', href: '/settlements', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 px-6 bg-blue-600 border-b border-blue-700">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-white">Smart Splitter</h1>
              <p className="text-blue-100 text-base">Expense Manager</p>
            </motion.div>
          </div>

          {/* User info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 border-b border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-base">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900 truncate">{user?.username}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <NavLink
                    to={item.href}
                    className={`group flex items-center px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className={`h-6 w-6 mr-4 ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                    <span>{item.name}</span>
                  </NavLink>
                </motion.div>
              );
            })}
          </nav>

          {/* Logout button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-3 border-t border-gray-200"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-red-500" />
              Sign out
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
