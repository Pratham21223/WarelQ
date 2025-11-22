import { motion } from 'framer-motion';
import ReceiptRow from './ReceiptRow';
import { InboxIcon } from '@heroicons/react/24/outline';

export default function ReceiptsTable({ receipts = [], isLoading, onView, onEdit, onDelete, onValidate }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading receipts...</p>
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
        <InboxIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No receipts found</h3>
        <p className="text-gray-600">Create your first receipt to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Reference</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Supplier</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Warehouse</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Items</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {receipts.map((receipt, index) => (
              <ReceiptRow 
                key={receipt.id} 
                receipt={receipt} 
                index={index}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onValidate={onValidate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
