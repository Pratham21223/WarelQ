// components/delivery/DeliveryDetailsPanel.jsx
import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  TruckIcon, 
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

export default function DeliveryDetailsPanel({ delivery, onClose }) {
  if (!delivery) return null;

  const statusSteps = [
    { key: 'draft', label: 'Draft', icon: ClockIcon },
    { key: 'waiting', label: 'Waiting', icon: ClockIcon },
    { key: 'dispatched', label: 'In Transit', icon: TruckIcon },
    { key: 'delivered', label: 'Delivered', icon: CheckCircleIcon }
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.key === delivery.status);

  // Calculate total value
  const totalValue = delivery.delivery_items?.reduce((sum, item) => {
    return sum + (item.quantity * item.unit_price);
  }, 0) || 0;

  return (
    <AnimatePresence>
      <Dialog open={!!delivery} onClose={onClose} className="relative z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                as={motion.div}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="pointer-events-auto w-screen max-w-md"
              >
                <div className="flex h-full flex-col bg-white shadow-xl">
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-slate-200)', background: 'var(--color-slate-50)' }}>
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-lg font-semibold text-slate-900">
                        Delivery Details
                      </DialogTitle>
                      <button onClick={onClose} className="action-btn">
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm font-mono text-slate-600">
                        {delivery.reference_number}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* Status Timeline */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-4">Status Timeline</h3>
                      <div className="relative pl-8">
                        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="absolute left-2 top-2 w-0.5 bg-slate-900"
                        ></motion.div>

                        <div className="space-y-4">
                          {statusSteps.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            return (
                              <div key={step.key} className="relative flex items-center gap-3">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 z-10 ${
                                    isCompleted
                                      ? 'bg-slate-900 border-slate-900'
                                      : 'bg-white border-slate-300'
                                  }`}
                                />
                                <div className={`${isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                                  <div className="text-sm font-medium">{step.label}</div>
                                  {isCurrent && (
                                    <div className="text-xs text-slate-500">Current status</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Information */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-4">Delivery Info</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPinIcon className="w-4 h-4 text-slate-500 mt-0.5" />
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Destination</div>
                            <div className="font-medium text-slate-900">{delivery.destination}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t" style={{ borderColor: 'var(--color-slate-200)' }}>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Warehouse</div>
                            <div className="text-sm font-medium text-slate-900">
                              {delivery.warehouse?.name || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Delivery Date</div>
                            <div className="text-sm font-medium text-slate-900">
                              {new Date(delivery.delivery_date).toLocaleDateString('en-IN')}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Created By</div>
                            <div className="text-sm font-medium text-slate-900">
                              {delivery.user?.name || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Total Value</div>
                            <div className="text-sm font-semibold text-slate-900">
                              ₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-4">
                        Items ({delivery.delivery_items?.length || 0})
                      </h3>
                      <div className="space-y-3">
                        {delivery.delivery_items?.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-lg"
                            style={{ background: 'var(--color-slate-50)' }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-slate-900 text-sm">
                                  {item.product?.name || 'Product'}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                  SKU: {item.product?.sku || 'N/A'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-slate-900">
                                  Qty: {item.quantity}
                                </div>
                                <div className="text-xs text-slate-500">
                                  ₹{item.unit_price.toLocaleString('en-IN')}
                                </div>
                                <div className="text-xs font-semibold text-slate-700 mt-1">
                                  ₹{(item.quantity * item.unit_price).toLocaleString('en-IN')}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {delivery.notes && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-2">Notes</h3>
                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                          {delivery.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--color-slate-200)' }}>
                    <button
                      onClick={onClose}
                      className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
}
