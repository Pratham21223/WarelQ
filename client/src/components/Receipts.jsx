// pages/Receipts.jsx
import { useState, useEffect } from 'react';
import ReceiptsHeader from '../components/receipts/ReceiptsHeader';
import ReceiptsFilters from '../components/receipts/ReceiptsFilters';
import ReceiptsTable from '../components/receipts/ReceiptsTable';
import CreateReceiptModal from '../components/receipts/CreateReceiptModal';
import ViewReceiptModal from '../components/receipts/ViewReceiptModal';
import EditReceiptModal from '../components/receipts/EditReceiptModal';
import { fetchReceipts, createReceipt, updateReceipt, deleteReceipt, fetchReceiptById } from '../services/receiptsApi';
import { transformReceiptFromAPI, transformReceiptToAPI } from '../utils/receiptTransformers';

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all'
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Load receipts on component mount
  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchReceipts();
      const transformedReceipts = data.map(transformReceiptFromAPI);
      setReceipts(transformedReceipts);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load receipts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReceipt = async (receiptData) => {
    try {
      const apiData = transformReceiptToAPI(receiptData);
      const newReceipt = await createReceipt(apiData);
      const transformedReceipt = transformReceiptFromAPI(newReceipt);
      setReceipts([transformedReceipt, ...receipts]);
      setIsCreateModalOpen(false);
      alert('Receipt created successfully!');
    } catch (err) {
      alert(`Failed to create receipt: ${err.message}`);
      console.error('Create error:', err);
    }
  };

  const handleView = async (receipt) => {
    try {
      const fullReceipt = await fetchReceiptById(receipt.id);
      const transformedReceipt = transformReceiptFromAPI(fullReceipt);
      setSelectedReceipt(transformedReceipt);
      setIsViewModalOpen(true);
    } catch (err) {
      alert(`Failed to load receipt details: ${err.message}`);
      console.error('View error:', err);
    }
  };

  const handleEdit = async (receipt) => {
    try {
      const fullReceipt = await fetchReceiptById(receipt.id);
      const transformedReceipt = transformReceiptFromAPI(fullReceipt);
      setSelectedReceipt(transformedReceipt);
      setIsEditModalOpen(true);
    } catch (err) {
      alert(`Failed to load receipt for editing: ${err.message}`);
      console.error('Edit error:', err);
    }
  };

  const handleUpdateReceipt = async (updatedReceipt) => {
    try {
      const apiData = transformReceiptToAPI(updatedReceipt);
      const updated = await updateReceipt(updatedReceipt.id, apiData);
      const transformedReceipt = transformReceiptFromAPI(updated);
      
      setReceipts(receipts.map(r => 
        r.id === transformedReceipt.id ? transformedReceipt : r
      ));
      setIsEditModalOpen(false);
      setSelectedReceipt(null);
      alert('Receipt updated successfully!');
    } catch (err) {
      alert(`Failed to update receipt: ${err.message}`);
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (receipt) => {
    if (!confirm(`Are you sure you want to delete receipt ${receipt.referenceNo}?`)) {
      return;
    }

    try {
      await deleteReceipt(receipt.id);
      setReceipts(receipts.filter(r => r.id !== receipt.id));
      alert('Receipt deleted successfully!');
    } catch (err) {
      alert(`Failed to delete receipt: ${err.message}`);
      console.error('Delete error:', err);
    }
  };

  const handleValidate = async (receipt) => {
    try {
      const apiData = transformReceiptToAPI({ ...receipt, status: 'validated' });
      const updated = await updateReceipt(receipt.id, apiData);
      const transformedReceipt = transformReceiptFromAPI(updated);
      
      setReceipts(receipts.map(r => 
        r.id === transformedReceipt.id ? transformedReceipt : r
      ));
      alert('Receipt validated successfully!');
    } catch (err) {
      alert(`Failed to validate receipt: ${err.message}`);
      console.error('Validate error:', err);
    }
  };

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.referenceNo.toLowerCase().includes(filters.search.toLowerCase()) ||
                         receipt.supplier.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || receipt.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  // Error display
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Receipts</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={loadReceipts}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Pass receipts data to header */}
      <ReceiptsHeader 
        onCreateClick={() => setIsCreateModalOpen(true)} 
        receipts={receipts}
      />
      
      <div className="mt-6">
        <ReceiptsFilters filters={filters} setFilters={setFilters} />
      </div>

      <div className="mt-6">
        <ReceiptsTable
          receipts={filteredReceipts}
          isLoading={isLoading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onValidate={handleValidate}
        />
      </div>

      {/* Create Receipt Modal */}
      <CreateReceiptModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReceipt}
      />

      {/* View Receipt Modal */}
      <ViewReceiptModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedReceipt(null);
        }}
        receipt={selectedReceipt}
      />

      {/* Edit Receipt Modal */}
      <EditReceiptModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReceipt(null);
        }}
        receipt={selectedReceipt}
        onUpdate={handleUpdateReceipt}
      />
    </div>
  );
}
