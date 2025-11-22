import { useState, useEffect } from 'react';

export function useReceipts(filters) {
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      let mockReceipts = [
        {
          id: 1,
          referenceNo: 'RCP-2025-001',
          supplier: 'ABC Suppliers Ltd.',
          warehouse: 'Main Warehouse',
          date: '2025-11-22',
          status: 'validated',
          itemCount: 5
        },
        {
          id: 2,
          referenceNo: 'RCP-2025-002',
          supplier: 'XYZ Trading Co.',
          warehouse: 'Secondary Storage',
          date: '2025-11-21',
          status: 'waiting',
          itemCount: 3
        },
        {
          id: 3,
          referenceNo: 'RCP-2025-003',
          supplier: 'Global Imports Inc.',
          warehouse: 'Distribution Center',
          date: '2025-11-20',
          status: 'draft',
          itemCount: 8
        }
      ];
      
      // Apply filters
      if (filters.status !== 'all') {
        mockReceipts = mockReceipts.filter(r => r.status === filters.status);
      }
      if (filters.warehouse !== 'all') {
        mockReceipts = mockReceipts.filter(r => r.warehouse === filters.warehouse);
      }
      if (filters.search) {
        mockReceipts = mockReceipts.filter(r => 
          r.referenceNo.toLowerCase().includes(filters.search.toLowerCase()) ||
          r.supplier.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setReceipts(mockReceipts);
      setIsLoading(false);
    };

    fetchData();
  }, [filters]);

  // Add new receipt
  const addReceipt = (receiptData) => {
    const newReceipt = {
      id: Date.now(),
      ...receiptData,
      itemCount: receiptData.lineItems?.length || 0
    };
    setReceipts(prev => [newReceipt, ...prev]);
  };

  // Update receipt
  const updateReceipt = (id, updates) => {
    setReceipts(prev => prev.map(r => 
      r.id === id ? { ...r, ...updates } : r
    ));
  };

  // Delete receipt
  const deleteReceipt = (id) => {
    setReceipts(prev => prev.filter(r => r.id !== id));
  };

  return { receipts, isLoading, addReceipt, updateReceipt, deleteReceipt };
}
