// components/delivery/EditDeliveryModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function EditDeliveryModal({ delivery, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    id: '',
    customer: '',
    customerEmail: '',
    warehouse: '',
    scheduledDate: '',
    expectedDeliveryDate: '',
    items: []
  });

  useEffect(() => {
    if (delivery) {
      setFormData({
        id: delivery.id,
        customer: delivery.customer.name,
        customerEmail: delivery.customer.email,
        warehouse: delivery.warehouse,
        scheduledDate: delivery.scheduledDate,
        expectedDeliveryDate: delivery.expectedDeliveryDate,
        items: delivery.items || []
      });
    }
  }, [delivery]);

  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    sku: '',
    price: 0
  });

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem, id: Date.now() }]
      }));
      setNewItem({ name: '', quantity: 1, sku: '', price: 0 });
    }
  };

  const handleRemoveItem = (id) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (!delivery) return null;

  return (
    <AnimatePresence>
      <Dialog open={!!delivery} onClose={onClose} className="relative z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            as={motion.div}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden"
            style={{ border: '1px solid var(--color-slate-200)' }}
          >
            <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-slate-200)', background: 'var(--color-slate-50)' }}>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-slate-900">
                  Edit Delivery - {formData.id}
                </DialogTitle>
                <button onClick={onClose} className="action-btn">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">Customer Name *</label>
                      <input
                        type="text"
                        value={formData.customer}
                        onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
                        className="filter-input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                        className="filter-input w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Delivery Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">Warehouse *</label>
                      <select
                        value={formData.warehouse}
                        onChange={(e) => setFormData(prev => ({ ...prev, warehouse: e.target.value }))}
                        className="filter-input w-full"
                      >
                        <option value="Mumbai Central">Mumbai Central</option>
                        <option value="Pune West">Pune West</option>
                        <option value="Delhi North">Delhi North</option>
                        <option value="Bangalore Tech Park">Bangalore Tech Park</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">Scheduled Date *</label>
                      <input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                        className="filter-input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-2">Expected Delivery *</label>
                      <input
                        type="date"
                        value={formData.expectedDeliveryDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                        className="filter-input w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Items</h3>
                  {formData.items.length > 0 && (
                    <div className="border rounded-lg overflow-hidden mb-4" style={{ borderColor: 'var(--color-slate-200)' }}>
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Product</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">SKU</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Qty</th>
                            <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.items.map((item) => (
                            <tr key={item.id} className="border-t" style={{ borderColor: 'var(--color-slate-100)' }}>
                              <td className="px-4 py-3 text-sm text-slate-700">{item.name}</td>
                              <td className="px-4 py-3 text-sm text-slate-500">{item.sku}</td>
                              <td className="px-4 py-3 text-sm text-slate-700">{item.quantity}</td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-red-600 hover:text-red-700 p-1"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--color-slate-200)', background: 'var(--color-slate-50)' }}>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </AnimatePresence>
  );
}
