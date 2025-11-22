// components/delivery/DeliveryTable.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon, 
  PencilIcon, 
  PrinterIcon,
  TruckIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const statusConfig = {
  draft: { 
    label: 'Draft', 
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    dotColor: 'bg-gray-500'
  },
  waiting: { 
    label: 'Waiting', 
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    dotColor: 'bg-amber-500'
  },
  dispatched: { 
    label: 'Dispatched', 
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    dotColor: 'bg-blue-500'
  },
  delivered: { 
    label: 'Delivered', 
    color: 'bg-green-100 text-green-700 border-green-300',
    dotColor: 'bg-green-500'
  }
};

export default function DeliveryTable({ deliveries = [], isLoading, onDeliveryClick }) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (deliveries.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="delivery-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Warehouse
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {deliveries.map((delivery, index) => (
                <motion.tr
                  key={delivery.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.4,
                    type: 'spring',
                    stiffness: 100,
                    damping: 15
                  }}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onDeliveryClick(delivery)}
                >
                  {/* Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <span className={`delivery-badge-pulse w-2 h-2 rounded-full ${statusConfig[delivery.status]?.dotColor}`} />
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[delivery.status]?.color}`}>
                        {statusConfig[delivery.status]?.label}
                      </span>
                    </div>
                  </td>

                  {/* Reference */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                      {delivery.reference}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {delivery.customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {delivery.customer.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {delivery.customer.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Warehouse */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{delivery.warehouse}</span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(delivery.scheduledDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </td>

                  {/* Items */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {delivery.items.length} {delivery.items.length === 1 ? 'product' : 'products'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton 
                        icon={EyeIcon} 
                        tooltip="View" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeliveryClick(delivery);
                        }}
                      />
                      <ActionButton 
                        icon={PencilIcon} 
                        tooltip="Edit"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {delivery.status === 'waiting' && (
                        <ActionButton 
                          icon={TruckIcon} 
                          tooltip="Mark as Dispatched"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      {delivery.status === 'dispatched' && (
                        <ActionButton 
                          icon={CheckIcon} 
                          tooltip="Mark as Delivered"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      <ActionButton 
                        icon={PrinterIcon} 
                        tooltip="Print"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, tooltip, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative group"
      aria-label={tooltip}
    >
      <Icon className="w-5 h-5" />
      <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {tooltip}
      </span>
    </motion.button>
  );
}

function TableSkeleton() {
  return (
    <div className="delivery-card overflow-hidden">
      <div className="animate-pulse p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="delivery-card p-12 text-center">
      <TruckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries found</h3>
      <p className="text-gray-500">Create a new delivery to get started.</p>
    </div>
  );
}
