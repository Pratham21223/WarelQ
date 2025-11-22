// src/components/dashboard/KPICard.jsx
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const KPICard = ({ title, value, change, trend, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <motion.div
      whileHover={{ y: -4, shadow: 'lg' }}
      className="bg-white rounded-xl shadow-md border border-gray-100 p-6 cursor-pointer overflow-hidden relative transition-shadow"
    >
      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-5 rounded-full -mr-16 -mt-16`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <motion.h3
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            {value}
          </motion.h3>
          <div className="flex items-center space-x-1">
            {trend === 'up' ? (
              <ArrowUpIcon className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-sm font-semibold ${
                trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {change}
            </span>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        </div>

        <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-lg text-white shadow-md`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;
