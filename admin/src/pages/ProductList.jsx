import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiBox } from 'react-icons/fi';
import productService from '../services/productService';
import { deleteImage } from '../utils/uploadImage';
import { toast } from 'react-toastify';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All'); // All, Active, Inactive

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch products. Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Fetch the product first to get image paths
        const product = await productService.getProductById(id);
        
        // Delete primary image
        if (product.imagePath) {
          try { await deleteImage(product.imagePath); } catch (e) { console.warn("Failed to delete primary image", e); }
        }

        // Delete gallery images
        if (product.images && product.images.length > 0) {
          for (const img of product.images) {
            if (img.imagePath) {
              try { await deleteImage(img.imagePath); } catch (e) { console.warn("Failed to delete gallery image", e); }
            }
          }
        }

        // Delete from database
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        toast.success("Product deleted successfully!");
      } catch (err) {
        console.error(err);
        toast.error('Error deleting product');
      }
    }
  };

  const toggleStatus = async (product) => {
    const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    // Optimistic Update
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
    
    try {
      await productService.updateProduct(product.id, { status: newStatus });
      toast.success(`${product.name} is now ${newStatus}`);
    } catch (err) {
      console.error(err);
      // Revert Optimistic Update
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: product.status } : p));
      toast.error('Failed to update product status');
    }
  };

  const filteredProducts = products.filter(p => {
    if (filter === 'Active') return p.status === 'ACTIVE';
    if (filter === 'Inactive') return p.status === 'INACTIVE';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair flex items-center">
            <FiBox className="mr-3 text-brand-plum" /> Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your luxury food catalog</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
            <button onClick={() => setFilter('All')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'All' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>All</button>
            <button onClick={() => setFilter('Active')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'Active' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Active</button>
            <button onClick={() => setFilter('Inactive')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'Inactive' ? 'bg-red-50 text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Inactive</button>
          </div>
          <Link 
            to="/products/add" 
            className="flex items-center space-x-2 bg-brand-plum text-white px-5 py-2.5 rounded-lg hover:bg-brand-plum/90 transition-colors shadow-md font-medium text-sm"
          >
            <FiPlus />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Created Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="8" className="p-8 text-center text-gray-500">Loading products...</td></tr>
              ) : error ? (
                <tr><td colSpan="8" className="p-8 text-center text-red-500">{error}</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-gray-500">No products found for this filter.</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 bg-gray-100 rounded object-cover overflow-hidden flex items-center justify-center text-xs text-gray-400 border border-gray-200">
                        {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : 'No Img'}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-500 truncate w-48">{product.description}</p>
                    </td>
                    <td className="p-4">
                      <span className="bg-brand-cream text-brand-plum text-xs px-2.5 py-1 rounded-full font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      ₹{product.price}
                      {product.offerPrice && <span className="text-xs text-green-600 block">Discount: ₹{product.offerPrice}</span>}
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        {/* Animated Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => toggleStatus(product)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-plum focus:ring-offset-2 ${product.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <span className="sr-only">Toggle Status</span>
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${product.status === 'ACTIVE' ? 'translate-x-5' : 'translate-x-0'}`}
                          />
                        </button>
                        
                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {product.status || 'ACTIVE'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link to={`/products/edit/${product.id}`} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded transition-colors">
                          <FiEdit2 size={16} />
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded transition-colors">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
