// pages/Products.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductsHeader from '../components/products/ProductsHeader';
import ProductsGrid from '../components/products/ProductsGrid';
import ProductsTable from '../components/products/ProductsTable';
import CreateProductModal from '../components/products/CreateProductModal';
import ProductDetailsModal from '../components/products/ProductDetailsModal';
import ProductFilters from '../components/products/ProductFilters';

const API_BASE_URL = 'https://wareiqserver.vercel.app/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    sortBy: 'name'
  });

  const [viewMode, setViewMode] = useState('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Map backend data to frontend format
  const mapBackendToFrontend = (item) => {
    // Calculate stock status
    const stock = item.stock_quantity || 0;
    const minStock = item.reorder_level || 0;
    let status = 'active';
    
    if (stock === 0) {
      status = 'out_of_stock';
    } else if (stock <= minStock) {
      status = 'low_stock';
    }

    return {
      id: item.id,
      name: item.name,
      sku: item.sku,
      description: item.description || '',
      category: item.category,
      price: parseFloat(item.unit_price),
      stock: stock,
      minStock: minStock,
      supplier: item.supplier || 'N/A',
      image: item.image_url || `https://via.placeholder.com/300x300/6366f1/ffffff?text=${encodeURIComponent(item.name.substring(0, 10))}`,
      status: status,
      lastUpdated: new Date(item.updated_at || item.created_at).toISOString().split('T')[0],
      isActive: item.is_active
    };
  };

  // Map frontend data to backend format
  const mapFrontendToBackend = (product) => ({
    name: product.name,
    sku: product.sku,
    description: product.description || '',
    category: product.category,
    unit_price: product.price,
    stock_quantity: product.stock,
    reorder_level: product.minStock,
    supplier: product.supplier,
    image_url: product.image,
    is_active: true
  });

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const mappedProducts = data.map(mapBackendToFrontend);
      setProducts(mappedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please make sure the backend server is running on localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Update product
        const response = await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mapFrontendToBackend(productData)),
        });

        if (!response.ok) {
          throw new Error('Failed to update product');
        }

        const updatedProduct = await response.json();
        setProducts(products.map(p => 
          p.id === editingProduct.id ? mapBackendToFrontend(updatedProduct) : p
        ));
        setEditingProduct(null);
      } else {
        // Create new product
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mapFrontendToBackend(productData)),
        });

        if (!response.ok) {
          throw new Error('Failed to create product');
        }

        const newProduct = await response.json();
        setProducts([mapBackendToFrontend(newProduct), ...products]);
      }
      
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Something went wrong while saving the product. Please try again.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setSelectedProduct(null);
    setIsCreateModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Something went wrong while deleting the product. Please try again.');
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setEditingProduct(null);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           product.sku.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
      const matchesStatus = filters.status === 'all' || product.status === filters.status;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.price - a.price;
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ProductsHeader 
        onCreateClick={() => setIsCreateModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalProducts={products.length}
        lowStockCount={products.filter(p => p.status === 'low_stock').length}
        outOfStockCount={products.filter(p => p.status === 'out_of_stock').length}
      />

      <div className="mt-6">
        <ProductFilters filters={filters} setFilters={setFilters} />
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <ProductsGrid
              key="grid"
              products={filteredProducts}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ) : (
            <ProductsTable
              key="table"
              products={filteredProducts}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}
        </AnimatePresence>
      </div>

      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateProduct}
        editingProduct={editingProduct}
      />

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={handleEditProduct}
        />
      )}
    </div>
  );
}
