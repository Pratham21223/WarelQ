import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DocumentScanner from './DocumentScanner';
import LineItemsTable from './LineItemsTable';

export default function CreateReceiptModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    supplierId: '',
    supplier: '',
    warehouseId: '',
    warehouse: '',
    expectedDate: '',
    referenceNo: `RCP-${Date.now()}`,
    notes: ''
  });
  
  const [lineItems, setLineItems] = useState([]);

  // Mock data - replace with actual API calls to fetch suppliers and warehouses
  const suppliers = [
    { id: 1, name: 'ABC Suppliers Ltd.' },
    { id: 2, name: 'XYZ Trading Co.' },
    { id: 3, name: 'Global Imports Inc.' }
  ];

  const warehouses = [
    { id: 1, name: 'Main Warehouse' },
    { id: 2, name: 'Secondary Storage' },
    { id: 3, name: 'Distribution Center' }
  ];

  const handleScanComplete = (scannedData) => {
    setLineItems(scannedData);
  };

  const handleSupplierChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selected = suppliers.find(s => s.id === selectedId);
    setFormData({
      ...formData,
      supplierId: selectedId,
      supplier: selected?.name || ''
    });
  };

  const handleWarehouseChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selected = warehouses.find(w => w.id === selectedId);
    setFormData({
      ...formData,
      warehouseId: selectedId,
      warehouse: selected?.name || ''
    });
  };

  const handleSubmit = (status) => {
    // Validation
    if (!formData.supplierId || !formData.warehouseId || !formData.expectedDate) {
      alert('Please fill in all required fields (Supplier, Warehouse, Date)!');
      return;
    }

    if (lineItems.length === 0) {
      alert('Please add at least one line item!');
      return;
    }

    // Check if all line items have required data
    const invalidItems = lineItems.filter(item => 
      !item.productName || 
      !item.expectedQty || 
      item.expectedQty <= 0
    );

    if (invalidItems.length > 0) {
      alert('Please ensure all line items have a product name and quantity greater than 0!');
      return;
    }

    // Prepare data
    const receiptData = {
      supplierId: formData.supplierId,
      supplier: formData.supplier,
      warehouseId: formData.warehouseId,
      warehouse: formData.warehouse,
      expectedDate: formData.expectedDate,
      date: formData.expectedDate,
      status,
      notes: formData.notes,
      lineItems: lineItems.map(item => ({
        ...item,
        productId: item.productId || null,
        expectedQty: parseInt(item.expectedQty) || 0,
        receivedQty: parseInt(item.receivedQty) || 0,
        unitPrice: parseFloat(item.unitPrice) || 0
      }))
    };

    console.log('Submitting receipt:', receiptData); // DEBUG
    onSubmit(receiptData);
    
    // Reset form
    setFormData({
      supplierId: '',
      supplier: '',
      warehouseId: '',
      warehouse: '',
      expectedDate: '',
      referenceNo: `RCP-${Date.now()}`,
      notes: ''
    });
    setLineItems([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create New Receipt</h2>
                  <p className="text-sm text-gray-600">Register incoming stock delivery</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg">
                  <XMarkIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Supplier *</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.supplierId}
                      onChange={handleSupplierChange}
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse *</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.warehouseId}
                      onChange={handleWarehouseChange}
                    >
                      <option value="">Select Warehouse</option>
                      {warehouses.map(warehouse => (
                        <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Date *</label>
                    <input 
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.expectedDate}
                      onChange={(e) => setFormData({...formData, expectedDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      value={formData.referenceNo}
                      readOnly
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Add any additional notes..."
                    />
                  </div>
                </div>
                
                <DocumentScanner onScanComplete={handleScanComplete} />
                <LineItemsTable items={lineItems} setItems={setLineItems} />
              </div>
              
              <div className="flex items-center justify-end gap-3 p-5 border-t bg-gray-50">
                <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                  Cancel
                </button>
                <button 
                  onClick={() => handleSubmit('draft')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Save Draft
                </button>
                <button 
                  onClick={() => handleSubmit('validated')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Validate Receipt
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
