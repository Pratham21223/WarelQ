const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for handling API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// GET all receipts
export const fetchReceipts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/receipts`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching receipts:', error);
    throw error;
  }
};

// GET single receipt by ID
export const fetchReceiptById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/receipts/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching receipt ${id}:`, error);
    throw error;
  }
};

// POST create new receipt
export const createReceipt = async (receiptData) => {
  try {
    console.log('Creating receipt with data:', receiptData); // DEBUG
    const response = await fetch(`${API_BASE_URL}/receipts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiptData),
    });
    
    // Log response for debugging
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', responseText);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error creating receipt:', error);
    throw error;
  }
};


// PUT update receipt
export const updateReceipt = async (id, receiptData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/receipts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiptData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error updating receipt ${id}:`, error);
    throw error;
  }
};

// DELETE receipt - FIX: Add DELETE method
export const deleteReceipt = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/receipts/${id}`, {
      method: 'DELETE', // Add this line
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error deleting receipt ${id}:`, error);
    throw error;
  }
};


// GET receipt line items
export const fetchReceiptLines = async (receiptId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/receipts/${receiptId}/lines`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching lines for receipt ${receiptId}:`, error);
    throw error;
  }
};

// DELETE receipt line item
export const deleteReceiptLine = async (receiptId, lineId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/receipts/${receiptId}/lines/${lineId}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error deleting line ${lineId}:`, error);
    throw error;
  }
};

// GET product by ID
export const fetchProductById = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error;
  }
};
