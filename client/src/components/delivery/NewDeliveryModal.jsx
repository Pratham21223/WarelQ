// components/delivery/NewDeliveryModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function NewDeliveryModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    warehouse_id: '',
    destination: '',
    delivery_date: '',
    status: 'draft',
    notes: '',
    items: []
  });

  // STATIC WAREHOUSES - No API call needed
  const warehouses = [
    { id: 1, name: 'Mumbai Central' },
    { id: 2, name: 'Pune West' },
    { id: 3, name: 'Delhi North' },
    { id: 4, name: 'Bangalore Tech Park' },
    { id: 5, name: 'Kolkata East' },
    { id: 6, name: 'Chennai South' }
  ];

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [newItem, setNewItem] = useState({
    product_id: '',
    quantity: 1,
    unit_price: 0
  });

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddItem = () => {
    if (newItem.product_id && newItem.quantity > 0) {
      const selectedProduct = products.find(p => p.id === parseInt(newItem.product_id));
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, {
          ...newItem,
          id: Date.now(),
          product: selectedProduct
        }]
      }));
      setNewItem({ product_id: '', quantity: 1, unit_price: 0 });
    }
  };

  const handleRemoveItem = (id) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = (status) => {
    const deliveryData = {
      ...formData,
      status,
      warehouse_id: parseInt(formData.warehouse_id),
      items: formData.items.map(item => ({
        product_id: parseInt(item.product_id),
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.unit_price)
      }))
    };
    
    onSubmit(deliveryData);
    
    // Reset form
    setFormData({
      warehouse_id: '',
      destination: '',
      delivery_date: '',
      status: 'draft',
      notes: '',
      items: []
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog 
          open={isOpen} 
          onClose={onClose}
          className="relative z-50"
        >
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
                    New Delivery
                  </DialogTitle>
                  <button onClick={onClose} className="action-btn">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Delivery Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-2">
                          Warehouse *
                        </label>
                        <select
                          value={formData.warehouse_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, warehouse_id: e.target.value }))}
                          className="filter-input w-full"
                          required
                        >
                          <option value="">Select warehouse</option>
                          {warehouses.map(warehouse => (
                            <option key={warehouse.id} value={warehouse.id}>
                              {warehouse.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-2">
                          Delivery Date *
                        </label>
                        <input
                          type="date"
                          value={formData.delivery_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, delivery_date: e.target.value }))}
                          className="filter-input w-full"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-600 mb-2">
                          Destination *
                        </label>
                        <input
                          type="text"
                          value={formData.destination}
                          onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                          className="filter-input w-full"
                          placeholder="Enter delivery destination address"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-600 mb-2">
                          Notes
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          className="filter-input w-full"
                          rows="3"
                          placeholder="Additional notes..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Items</h3>
                    
                    <div className="grid grid-cols-12 gap-2 mb-4">
                      <select
                        value={newItem.product_id}
                        onChange={(e) => {
                          const productId = e.target.value;
                          const product = products.find(p => p.id === parseInt(productId));
                          setNewItem(prev => ({ 
                            ...prev, 
                            product_id: productId,
                            unit_price: product?.price || 0
                          }));
                        }}
                        className="filter-input col-span-5"
                        disabled={loadingProducts}
                      >
                        <option value="">
                          {loadingProducts ? 'Loading products...' : 'Select product'}
                        </option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                        placeholder="Qty"
                        min="1"
                        className="filter-input col-span-2"
                      />
                      <input
                        type="number"
                        value={newItem.unit_price}
                        onChange={(e) => setNewItem(prev => ({ ...prev, unit_price: parseFloat(e.target.value) || 0 }))}
                        placeholder="Price"
                        min="0"
                        step="0.01"
                        className="filter-input col-span-3"
                      />
                      <button
                        onClick={handleAddItem}
                        disabled={!newItem.product_id}
                        className="col-span-2 flex items-center justify-center gap-1 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium disabled:bg-slate-400 disabled:cursor-not-allowed"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add
                      </button>
                    </div>

                    {formData.items.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-slate-200)' }}>
                        <table className="w-full">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Product</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Qty</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Price</th>
                              <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600">Total</th>
                              <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.items.map((item, index) => (
                              <motion.tr
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-t" 
                                style={{ borderColor: 'var(--color-slate-100)' }}
                              >
                                <td className="px-4 py-3 text-sm text-slate-700">
                                  {item.product?.name || 'Product'}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-700">{item.quantity}</td>
                                <td className="px-4 py-3 text-sm text-slate-500">₹{item.unit_price}</td>
                                <td className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">
                                  ₹{(item.quantity * item.unit_price).toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-600 hover:text-red-700 p-1"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{ borderColor: 'var(--color-slate-300)' }}>
                        <p className="text-sm text-slate-500">No items added yet. Add products above.</p>
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
                  onClick={() => handleSubmit('draft')}
                  disabled={!formData.warehouse_id || !formData.destination || !formData.delivery_date}
                  className="px-4 py-2 text-sm font-medium bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSubmit('waiting')}
                  disabled={!formData.warehouse_id || !formData.destination || !formData.delivery_date || formData.items.length === 0}
                  className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  Create Delivery
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
