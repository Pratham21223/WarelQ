// components/delivery/DeliveryHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  TruckIcon, 
  ClockIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

export default function DeliveryHeader({ deliveries = [] }) {
  const stats = calculateStats(deliveries);

  const statCards = [
    {
      label: 'Total Today',
      value: stats.total,
      icon: TruckIcon,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: ClockIcon,
      color: 'amber',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      label: 'Shipped',
      value: stats.shipped,
      icon: CheckCircleIcon,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Deliveries</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-lg p-4 border border-gray-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-full`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function calculateStats(deliveries) {
  return {
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === 'waiting' || d.status === 'draft').length,
    shipped: deliveries.filter(d => d.status === 'dispatched' || d.status === 'delivered').length
  };
}
