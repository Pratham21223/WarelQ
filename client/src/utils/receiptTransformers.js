// src/utils/receiptTransformers.js

// Transform API receipt to component format
export const transformReceiptFromAPI = (apiReceipt) => {
  return {
    id: apiReceipt.id,
    referenceNo: apiReceipt.reference_number,
    supplier: apiReceipt.supplier_name || '',
    supplierId: apiReceipt.supplier_id,
    warehouse: apiReceipt.warehouse_name || '',
    warehouseId: apiReceipt.warehouse_id,
    date: apiReceipt.expected_date ? apiReceipt.expected_date.split('T')[0] : '',
    expectedDate: apiReceipt.expected_date ? apiReceipt.expected_date.split('T')[0] : '',
    receivedDate: apiReceipt.received_date,
    status: apiReceipt.status,
    notes: apiReceipt.notes || '',
    itemCount: apiReceipt.items_count || apiReceipt.items?.length || 0,
    expectedTotal: parseFloat(apiReceipt.expected_total || 0),
    receivedTotal: parseFloat(apiReceipt.received_total || 0),
    lineItems: apiReceipt.items?.map(transformLineItemFromAPI) || [],
    createdAt: apiReceipt.created_at
  };
};

// Transform line item from API to component format
export const transformLineItemFromAPI = (apiItem) => {
  return {
    id: apiItem.id || Date.now() + Math.random(),
    receiptId: apiItem.receipt_id,
    productId: apiItem.product_id,
    productName: apiItem.product_name || '',
    sku: apiItem.sku || '',
    expectedQty: parseInt(apiItem.quantity) || 0,
    receivedQty: parseInt(apiItem.received_quantity) || 0,
    unitPrice: parseFloat(apiItem.unit_price || 0),
    totalPrice: parseFloat(apiItem.total_price || 0),
    unit: 'pcs' // Default unit
  };
};

// Transform component receipt to API format
export const transformReceiptToAPI = (componentReceipt) => {
  const apiData = {
    supplier_id: parseInt(componentReceipt.supplierId),
    warehouse_id: parseInt(componentReceipt.warehouseId),
    expected_date: componentReceipt.expectedDate || componentReceipt.date,
    status: componentReceipt.status || 'draft',
    notes: componentReceipt.notes || ''
  };

  // Only add items if they exist and are valid
  if (componentReceipt.lineItems && componentReceipt.lineItems.length > 0) {
    apiData.items = componentReceipt.lineItems.map(item => ({
      product_id: item.productId ? parseInt(item.productId) : null,
      quantity: parseInt(item.expectedQty) || 0,
      received_quantity: parseInt(item.receivedQty) || 0,
      unit_price: parseFloat(item.unitPrice) || 0
    }));
  } else {
    apiData.items = [];
  }

  console.log('Transformed API data:', apiData); // DEBUG
  return apiData;
};

// Transform line item to API format
export const transformLineItemToAPI = (componentItem) => {
  return {
    product_id: parseInt(componentItem.productId) || null,
    quantity: parseInt(componentItem.expectedQty) || 0,
    received_quantity: parseInt(componentItem.receivedQty) || 0,
    unit_price: parseFloat(componentItem.unitPrice) || 0
  };
};
