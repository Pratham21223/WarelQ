import { motion } from 'framer-motion';
import { EyeIcon, PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import StatusBadge from './StatusBadge';

export default function ReceiptRow({ receipt, index, onView, onEdit, onDelete, onValidate }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-blue-50/50 transition-colors"
    >
      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge status={receipt.status} />
      </td>
      
      {/* Reference */}
      <td className="px-6 py-4">
        <span className="font-semibold text-gray-900">{receipt.referenceNo}</span>
      </td>
      
      {/* Supplier */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-sm">
            {receipt.supplier.charAt(0)}
          </div>
          <span className="text-gray-900">{receipt.supplier}</span>
        </div>
      </td>
      
      {/* Warehouse */}
      <td className="px-6 py-4 text-gray-700">{receipt.warehouse}</td>
      
      {/* Date */}
      <td className="px-6 py-4 text-gray-700">{receipt.date}</td>
      
      {/* Items */}
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {receipt.itemCount} items
        </span>
      </td>
      
      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {/* View Button */}
          <button 
            onClick={() => onView(receipt)}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
            title="View Details"
          >
            <EyeIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
          </button>
          
          {/* Edit Button */}
          <button 
            onClick={() => onEdit(receipt)}
            className="p-2 hover:bg-amber-100 rounded-lg transition-colors group"
            title="Edit Receipt"
          >
            <PencilIcon className="w-5 h-5 text-gray-600 group-hover:text-amber-600" />
          </button>
          
          {/* Validate Button (only for draft/waiting) */}
          {(receipt.status === 'draft' || receipt.status === 'waiting') && (
            <button 
              onClick={() => onValidate(receipt)}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
              title="Validate Receipt"
            >
              <CheckIcon className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
            </button>
          )}
          
          {/* Delete Button */}
          <button 
            onClick={() => onDelete(receipt)}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
            title="Delete Receipt"
          >
            <TrashIcon className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
