// pages/DeliveryPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  PrinterIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

import { deliveryAPI } from '../services/deliveryApi';
import NewDeliveryModal from '../components/delivery/NewDeliveryModal';
import DeliveryDetailsPanel from '../components/delivery/DeliveryDetailsPanel';
import EditDeliveryModal from '../components/delivery/EditDeliveryModal';
import PrintableDelivery from '../components/delivery/PrintableDelivery';
import '../styles/delivery.css';

export default function DeliveryPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewDeliveryOpen, setIsNewDeliveryOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [printingDelivery, setPrintingDelivery] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    warehouse: 'all',
    search: ''
  });

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await deliveryAPI.getAll();
      setDeliveries(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load deliveries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDelivery = async (deliveryData) => {
    try {
      setError(null);
      
      // Create delivery
      const newDelivery = await deliveryAPI.create({
        reference_number: deliveryData.reference || `DEL-${Date.now()}`,
        warehouse_id: deliveryData.warehouse_id,
        destination: deliveryData.destination,
        delivery_date: deliveryData.delivery_date,
        status: deliveryData.status || 'draft',
        notes: deliveryData.notes || '',
        created_by: deliveryData.created_by || 1 // Replace with actual user ID
      });

      // Add line items
      if (deliveryData.items && deliveryData.items.length > 0) {
        await Promise.all(
          deliveryData.items.map(item =>
            deliveryAPI.lines.create(newDelivery.id, {
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: item.unit_price || 0
            })
          )
        );
      }

      // Reload deliveries
      await loadDeliveries();
      setIsNewDeliveryOpen(false);
      
      // Show success message (you can add a toast notification here)
      alert('Delivery created successfully!');
    } catch (err) {
      setError(err.message);
      alert('Failed to create delivery: ' + err.message);
    }
  };

  const handleUpdateDelivery = async (deliveryData) => {
    try {
      setError(null);
      
      // Update delivery
      await deliveryAPI.update(deliveryData.id, {
        warehouse_id: deliveryData.warehouse_id,
        destination: deliveryData.destination,
        delivery_date: deliveryData.delivery_date,
        status: deliveryData.status,
        notes: deliveryData.notes
      });

      // Reload deliveries
      await loadDeliveries();
      setEditingDelivery(null);
      
      alert('Delivery updated successfully!');
    } catch (err) {
      setError(err.message);
      alert('Failed to update delivery: ' + err.message);
    }
  };

  const handleView = async (delivery) => {
    try {
      // Fetch full delivery details with lines
      const fullDelivery = await deliveryAPI.getById(delivery.id);
      setSelectedDelivery(fullDelivery);
    } catch (err) {
      setError(err.message);
      alert('Failed to load delivery details: ' + err.message);
    }
  };

  const handleEdit = async (delivery) => {
    try {
      // Fetch full delivery details with lines
      const fullDelivery = await deliveryAPI.getById(delivery.id);
      setEditingDelivery(fullDelivery);
    } catch (err) {
      setError(err.message);
      alert('Failed to load delivery details: ' + err.message);
    }
  };

  const handlePrint = async (delivery) => {
    try {
      // Fetch full delivery details with lines
      const fullDelivery = await deliveryAPI.getById(delivery.id);
      setPrintingDelivery(fullDelivery);
      setTimeout(() => {
        window.print();
      }, 100);
    } catch (err) {
      setError(err.message);
      alert('Failed to load delivery for printing: ' + err.message);
    }
  };

  // Filter deliveries
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesStatus = filters.status === 'all' || delivery.status === filters.status;
    const matchesWarehouse = filters.warehouse === 'all' || delivery.warehouse?.id === parseInt(filters.warehouse);
    const matchesSearch = !filters.search || 
      delivery.reference_number?.toLowerCase().includes(filters.search.toLowerCase()) ||
      delivery.destination?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesWarehouse && matchesSearch;
  });

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === 'waiting' || d.status === 'draft').length,
    dispatched: deliveries.filter(d => d.status === 'dispatched').length,
    delivered: deliveries.filter(d => d.status === 'delivered').length
  };

  return (
    <>
      <div className="delivery-page">
        {/* Header Section */}
        <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--color-slate-200)' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="delivery-title">Deliveries</h1>
              <p className="delivery-subtitle mt-1">Manage and track all your outgoing shipments</p>
            </div>
            <button 
              className="primary-btn"
              onClick={() => setIsNewDeliveryOpen(true)}
            >
              <PlusIcon className="w-4 h-4" />
              New Delivery
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <ExclamationCircleIcon className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Error loading deliveries</p>
                <p className="text-xs text-red-600">{error}</p>
              </div>
              <button
                onClick={loadDeliveries}
                className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Total"
              value={stats.total}
              icon={<div className="w-2 h-2 rounded-full bg-slate-400" />}
              delay={0}
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              icon={<div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-amber-600)' }} />}
              delay={0.05}
            />
            <StatCard
              label="In Transit"
              value={stats.dispatched}
              icon={<div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-sky-600)' }} />}
              delay={0.1}
            />
            <StatCard
              label="Delivered"
              value={stats.delivered}
              icon={<div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-emerald-600)' }} />}
              delay={0.15}
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-sm relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search deliveries..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="filter-input w-full pl-9"
              />
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="filter-input"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="waiting">Waiting</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
            </select>

            <select
              value={filters.warehouse}
              onChange={(e) => setFilters(prev => ({ ...prev, warehouse: e.target.value }))}
              className="filter-input"
            >
              <option value="all">All Warehouses</option>
              {/* You can dynamically populate this from your warehouses data */}
              <option value="1">Warehouse 1</option>
              <option value="2">Warehouse 2</option>
              <option value="3">Warehouse 3</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="px-8 py-6">
          {isLoading ? (
            <TableSkeleton />
          ) : filteredDeliveries.length === 0 ? (
            <EmptyState />
          ) : (
            <table className="delivery-table w-full">
              <thead>
                <tr>
                  <th>Delivery ID</th>
                  <th>Status</th>
                  <th>Destination</th>
                  <th>Warehouse</th>
                  <th>Delivery Date</th>
                  <th>Items</th>
                  <th>Created By</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredDeliveries.map((delivery, index) => (
                    <motion.tr
                      key={delivery.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                    >
                      <td>
                        <span className="font-semibold text-slate-900">
                          {delivery.reference_number}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={delivery.status} />
                      </td>
                      <td className="text-slate-700">{delivery.destination}</td>
                      <td className="text-slate-700">
                        {delivery.warehouse?.name || 'N/A'}
                      </td>
                      <td className="text-slate-700">
                        {new Date(delivery.delivery_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="text-slate-700">
                        {delivery.delivery_items?.length || 0} items
                      </td>
                      <td className="text-slate-700">
                        {delivery.user?.name || 'N/A'}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <ActionButton 
                            icon={EyeIcon} 
                            tooltip="View" 
                            onClick={() => handleView(delivery)}
                          />
                          <ActionButton 
                            icon={PencilIcon} 
                            tooltip="Edit"
                            onClick={() => handleEdit(delivery)}
                          />
                          <ActionButton 
                            icon={PrinterIcon} 
                            tooltip="Print"
                            onClick={() => handlePrint(delivery)}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals and Panels */}
      <NewDeliveryModal
        isOpen={isNewDeliveryOpen}
        onClose={() => setIsNewDeliveryOpen(false)}
        onSubmit={handleCreateDelivery}
      />

      <DeliveryDetailsPanel
        delivery={selectedDelivery}
        onClose={() => setSelectedDelivery(null)}
      />

      <EditDeliveryModal
        delivery={editingDelivery}
        onClose={() => setEditingDelivery(null)}
        onSubmit={handleUpdateDelivery}
      />

      {printingDelivery && (
        <PrintableDelivery delivery={printingDelivery} />
      )}
    </>
  );
}

// Component definitions...
function StatCard({ label, value, icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="stat-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</div>
          <div className="text-2xl font-semibold text-slate-900">{value}</div>
        </div>
        <div className="opacity-60">{icon}</div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const config = {
    draft: { label: 'Draft', className: 'status-draft', dotColor: 'var(--color-slate-500)' },
    waiting: { label: 'Waiting', className: 'status-waiting', dotColor: 'var(--color-amber-600)' },
    dispatched: { label: 'In Transit', className: 'status-dispatched', dotColor: 'var(--color-sky-600)' },
    delivered: { label: 'Delivered', className: 'status-delivered', dotColor: 'var(--color-emerald-600)' }
  };

  const { label, className, dotColor } = config[status] || config.draft;

  return (
    <span className={`status-badge ${className}`}>
      <span className="status-dot" style={{ backgroundColor: dotColor }} />
      {label}
    </span>
  );
}

function ActionButton({ icon: Icon, tooltip, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="action-btn group"
      aria-label={tooltip}
    >
      <Icon className="w-4 h-4" />
      <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {tooltip}
      </span>
    </motion.button>
  );
}

function TableSkeleton() {
  return (
    <div className="delivery-table w-full">
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4"
          >
            <div className="h-3 bg-slate-100 rounded w-24 animate-pulse" />
            <div className="h-3 bg-slate-100 rounded w-20 animate-pulse" />
            <div className="h-3 bg-slate-100 rounded flex-1 animate-pulse" />
            <div className="h-3 bg-slate-100 rounded w-32 animate-pulse" />
            <div className="h-3 bg-slate-100 rounded w-20 animate-pulse" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="delivery-table w-full p-12 text-center">
      <div className="text-slate-400 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">No deliveries found</h3>
      <p className="text-slate-500">Create a new delivery to get started.</p>
    </div>
  );
}
