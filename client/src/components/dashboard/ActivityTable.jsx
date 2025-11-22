// src/components/dashboard/ActivityTable.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Badge from '../shared/Badge';

const ActivityTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activities] = useState([
    { id: 1, type: 'Receipt', product: 'MacBook Pro 16"', quantity: 50, status: 'Completed', date: '2025-11-22 09:30' },
    { id: 2, type: 'Delivery', product: 'iPhone 15 Pro', quantity: 120, status: 'In Transit', date: '2025-11-22 08:15' },
    { id: 3, type: 'Adjustment', product: 'AirPods Pro', quantity: -5, status: 'Completed', date: '2025-11-21 16:45' },
    { id: 4, type: 'Receipt', product: 'iPad Air', quantity: 75, status: 'Pending', date: '2025-11-21 14:20' },
    { id: 5, type: 'Delivery', product: 'Magic Keyboard', quantity: 30, status: 'Completed', date: '2025-11-21 11:00' }
  ]);

  const filteredActivities = activities.filter(activity =>
    activity.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'green';
      case 'Pending': return 'yellow';
      case 'In Transit': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          <span className="text-sm text-gray-500">Last 24 hours</span>
        </div>
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activities..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence>
              {filteredActivities.map((activity, index) => (
                <motion.tr
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={activity.type === 'Receipt' ? 'blue' : activity.type === 'Delivery' ? 'purple' : 'gray'}>
                      {activity.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {activity.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {activity.quantity > 0 ? `+${activity.quantity}` : activity.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {activity.date}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
