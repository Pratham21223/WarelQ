import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CalendarIcon, BuildingStorefrontIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import StatusBadge from './StatusBadge';

export default function ViewReceiptModal({ isOpen, onClose, receipt }) {
  if (!receipt) return null;

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
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Receipt Details</h2>
                  <p className="text-sm text-gray-600">View receipt information</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg">
                  <XMarkIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
                {/* Status and Reference */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Reference Number</label>
                    <p className="text-2xl font-bold text-gray-900">{receipt.referenceNo || 'N/A'}</p>
                  </div>
                  <StatusBadge status={receipt.status} />
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Supplier */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                        {receipt.supplier ? receipt.supplier.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-purple-600 uppercase">Supplier</label>
                        <p className="text-base font-semibold text-gray-900">{receipt.supplier || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Warehouse */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <BuildingStorefrontIcon className="w-10 h-10 text-blue-600" />
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-blue-600 uppercase">Warehouse</label>
                        <p className="text-base font-semibold text-gray-900">{receipt.warehouse || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-10 h-10 text-green-600" />
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-green-600 uppercase">Receipt Date</label>
                        <p className="text-base font-semibold text-gray-900">{receipt.date || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Item Count */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="w-10 h-10 text-amber-600" />
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-amber-600 uppercase">Total Items</label>
                        <p className="text-base font-semibold text-gray-900">{receipt.itemCount || 0} items</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {receipt.notes && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Notes</label>
                    <p className="text-gray-900">{receipt.notes}</p>
                  </div>
                )}

                {/* Line Items */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Line Items</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Product</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Expected</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Received</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Unit</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {receipt.lineItems && receipt.lineItems.length > 0 ? (
                          receipt.lineItems.map((item, index) => {
                            const hasDiscrepancy = item.expectedQty !== item.receivedQty;
                            return (
                              <tr key={item.id || index} className={hasDiscrepancy ? 'bg-amber-50/50' : ''}>
                                <td className="px-4 py-3">
                                  <div className="text-gray-900 font-medium">{item.productName || 'N/A'}</div>
                                  {item.sku && (
                                    <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-gray-700">{item.expectedQty || 0}</td>
                                <td className="px-4 py-3">
                                  <span className={hasDiscrepancy ? 'text-amber-700 font-semibold' : 'text-gray-700'}>
                                    {item.receivedQty || 0}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{item.unit || 'pcs'}</td>
                                <td className="px-4 py-3">
                                  {hasDiscrepancy ? (
                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                                      Discrepancy
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                      Match
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                              No line items available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-5 border-t bg-gray-50">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
