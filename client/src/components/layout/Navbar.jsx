import { Bars3Icon, BellIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-4 w-full transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
          
          {/* Search bar - expands when sidebar closes */}
          <div className={`relative transition-all duration-300 ${isSidebarOpen ? 'max-w-md' : 'max-w-2xl'} w-full`}>
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder={isSidebarOpen ? "Search..." : "Search products, receipts, suppliers, warehouses..."}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BellIcon className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Manager</p>
            </div>
            <UserCircleIcon className="w-10 h-10 text-gray-400" />
          </div>
        </div>
      </div>
    </nav>
  );
}
