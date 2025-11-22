import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  TruckIcon,
  CubeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function Sidebar({ isOpen, setIsOpen }) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Receipts', path: '/receipts', icon: DocumentTextIcon },
    { name: 'Deliveries', path: '/deliveries', icon: TruckIcon },
    { name: 'Products', path: '/products', icon: CubeIcon }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - slides in and out */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -256,
          width: isOpen ? 256 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed lg:relative inset-y-0 left-0 z-50 bg-gray-900 text-white overflow-hidden"
      >
        <div className="w-64">
          <div className="flex items-center justify-between p-5 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <CubeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">StockMaster</h1>
                <p className="text-xs text-gray-400">Inventory System</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.aside>
    </>
  );
}
