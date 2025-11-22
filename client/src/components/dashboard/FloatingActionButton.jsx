// src/components/dashboard/FloatingActionButton.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, DocumentTextIcon, TruckIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: DocumentTextIcon, label: 'New Receipt', color: 'bg-blue-500' },
    { icon: TruckIcon, label: 'New Delivery', color: 'bg-green-500' },
    { icon: AdjustmentsHorizontalIcon, label: 'New Adjustment', color: 'bg-purple-500' }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.5 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, x: -5 }}
                className={`${action.color} text-white px-4 py-3 rounded-full shadow-lg flex items-center space-x-3 hover:shadow-xl transition-shadow`}
              >
                <action.icon className="w-5 h-5" />
                <span className="font-medium">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/50 transition-shadow"
      >
        <PlusIcon className="w-8 h-8" />
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
