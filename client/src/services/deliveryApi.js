// src/services/deliveryApi.js
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for error handling
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function for making requests
const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Delivery API functions
export const deliveryAPI = {
  // Get all deliveries
  getAll: async () => {
    return fetchAPI('/deliveries');
  },

  // Get single delivery with lines
  getById: async (id) => {
    return fetchAPI(`/deliveries/${id}/lines`);
  },

  // Create new delivery
  create: async (deliveryData) => {
    return fetchAPI('/deliveries', {
      method: 'POST',
      body: JSON.stringify(deliveryData),
    });
  },

  // Update delivery
  update: async (id, deliveryData) => {
    return fetchAPI(`/deliveries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deliveryData),
    });
  },

  // Delete delivery
  delete: async (id) => {
    return fetchAPI(`/deliveries/${id}`, {
      method: 'DELETE',
    });
  },

  // Line items operations
  lines: {
    // Add line item to delivery
    create: async (deliveryId, lineData) => {
      return fetchAPI(`/deliveries/${deliveryId}/lines`, {
        method: 'POST',
        body: JSON.stringify(lineData),
      });
    },

    // Update line item
    update: async (deliveryId, lineId, lineData) => {
      return fetchAPI(`/deliveries/${deliveryId}/lines/${lineId}`, {
        method: 'PUT',
        body: JSON.stringify(lineData),
      });
    },

    // Delete line item
    delete: async (deliveryId, lineId) => {
      return fetchAPI(`/deliveries/${deliveryId}/lines/${lineId}`, {
        method: 'DELETE',
      });
    },
  },
};
