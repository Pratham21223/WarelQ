// src/components/layout/TopBar.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from '@headlessui/react';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { useUser, UserButton } from '@clerk/clerk-react'
const TopBar = () => {
  const [notifications, setNotifications] = useState(3);
  const [showNotificationPing, setShowNotificationPing] = useState(true);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, receipts, deliveries..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Notifications */}
          <motion.button
            onClick={() => setShowNotificationPing(false)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BellIcon className="w-6 h-6 text-gray-600" />
            {notifications > 0 && (
              <>
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {notifications}
                </span>
                {showNotificationPing && (
                  <motion.span
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </>
            )}
          </motion.button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
            <UserButton afterSignOutUrl="/signin" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
