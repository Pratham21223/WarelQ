import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import LineItemRow from './LineItemRow';

export default function LineItemsTable({ items, setItems }) {
  const addNewLine = () => {
    setItems([...items, {
      id: Date.now(),
      productId: null,
      productName: '',
      sku: '',
      expectedQty: 0,
      receivedQty: 0,
      unitPrice: 0,
      unit: 'pcs'
    }]);
  };

  const removeLine = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateLine = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">Line Items</h3>
        <button
          onClick={addNewLine}
          type="button"
          className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Add Product
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Expected</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Received</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Unit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <AnimatePresence>
              {items.map((item) => (
                <LineItemRow
                  key={item.id}
                  item={item}
                  updateLine={updateLine}
                  removeLine={removeLine}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No items added yet. Click "Add Product" to get started.</p>
          </div>
        )}
      </div>
      
      {items.length > 0 && (
        <div className="mt-3 flex justify-end gap-3">
          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <span className="text-sm text-gray-700">Total Items: </span>
            <span className="font-bold text-blue-700">{items.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
