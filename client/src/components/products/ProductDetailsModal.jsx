// components/products/ProductDetailsModal.jsx
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function ProductDetailsModal({ product, onClose, onEdit }) {
  const getStatusBadge = () => {
    // Since we don't have stock_quantity, we'll just show if active or not
    if (!product.isActive) {
      return { label: 'Inactive', color: 'bg-red-100 text-red-700' };
    }
    return { label: 'Active', color: 'bg-green-100 text-green-700' };
  };

  const badge = getStatusBadge();

  return (
    <Transition show={true} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <Dialog.Title className="text-xl font-bold text-gray-900">
                  Product Details
                </Dialog.Title>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex gap-6">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-48 h-48 rounded-xl object-cover border border-gray-200"
                  />
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                      <p className="text-gray-500 mt-1">SKU: {product.sku}</p>
                    </div>

                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                      {badge.label}
                    </span>

                    {product.description && (
                      <div className="pt-2">
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="text-gray-900">{product.description}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-semibold text-gray-900">{product.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-semibold text-gray-900">${product.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reorder Level</p>
                        <p className="font-semibold text-gray-900">{product.minStock} units</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Updated</p>
                        <p className="font-semibold text-gray-900">{product.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
