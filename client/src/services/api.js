// src/services/api.js
const API_BASE_URL = 'https://wareiqserver.vercel.app/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

// Map backend data to frontend format
const mapProductToFrontend = (product) => ({
  id: product.id,
  name: product.name,
  sku: product.sku,
  description: product.description || '',
  category: product.category,
  price: parseFloat(product.unit_price),
  stock: product.stock_quantity || 0,
  minStock: product.reorder_level || 0,
  supplier: product.supplier || 'N/A',
  image: product.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&size=200&background=random`,
  lastUpdated: new Date(product.created_at).toLocaleDateString('en-US'),
  status: product.stock_quantity === 0 
    ? 'out_of_stock' 
    : product.stock_quantity <= product.reorder_level 
    ? 'low_stock' 
    : 'active'
});

// Map frontend data to backend format
const mapProductToBackend = (product) => ({
  name: product.name,
  sku: product.sku,
  description: product.description || '',
  category: product.category,
  unit_price: product.price,
  stock_quantity: product.stock,
  reorder_level: product.minStock,
  supplier: product.supplier,
  image_url: product.image,
  is_active: product.status !== 'out_of_stock'
});

// API Functions
export const productAPI = {
  // Get all products
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await handleResponse(response);
      return data.map(mapProductToFrontend);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      const data = await handleResponse(response);
      return mapProductToFrontend(data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Create product
  create: async (productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mapProductToBackend(productData)),
      });
      const data = await handleResponse(response);
      return mapProductToFrontend(data);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  update: async (id, productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mapProductToBackend(productData)),
      });
      const data = await handleResponse(response);
      return mapProductToFrontend(data);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      await handleResponse(response);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};
