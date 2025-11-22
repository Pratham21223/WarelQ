import { motion } from 'framer-motion';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function LineItemRow({ item, updateLine, removeLine }) {
  const hasDiscrepancy = item.expectedQty !== item.receivedQty;

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`hover:bg-gray-50 transition-colors ${hasDiscrepancy ? 'bg-amber-50/50' : ''}`}
    >
      <td className="px-4 py-3">
        <input
          type="text"
          value={item.productName}
          onChange={(e) => updateLine(item.id, 'productName', e.target.value)}
          placeholder="Enter product name..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {item.sku && (
          <span className="text-xs text-gray-500 mt-1 block">SKU: {item.sku}</span>
        )}
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={item.expectedQty}
          onChange={(e) => updateLine(item.id, 'expectedQty', parseInt(e.target.value) || 0)}
          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          min="0"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={item.receivedQty}
          onChange={(e) => updateLine(item.id, 'receivedQty', parseInt(e.target.value) || 0)}
          className={`w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
            hasDiscrepancy 
              ? 'border-amber-400 focus:ring-amber-500 bg-amber-50' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          min="0"
        />
      </td>
      <td className="px-4 py-3">
        <select
          value={item.unit}
          onChange={(e) => updateLine(item.id, 'unit', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="pcs">pcs</option>
          <option value="kg">kg</option>
          <option value="box">box</option>
          <option value="ltr">ltr</option>
          <option value="m">m</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => removeLine(item.id)}
          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </td>
    </motion.tr>
  );
}
