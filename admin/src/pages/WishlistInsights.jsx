import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiHeart, FiTrendingUp, FiTrash2 } from 'react-icons/fi';

const WishlistInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await axios.get((import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/wishlist/admin/insights', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setInsights(res.data);
    } catch (error) {
      console.error('Failed to fetch wishlist insights', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to remove "${productName}" from customer wishlists? This action cannot be undone.`)) {
      setDeletingId(productId);
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('paidhu_token');
        await axios.delete(
          `${(import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app')}/api/wishlist/admin/product/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInsights(prev => prev.filter(item => item.product.id !== productId));
      } catch (error) {
        console.error('Failed to delete wishlist item:', error);
        alert('Failed to remove item from wishlist');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse font-medium">Loading Insights...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center font-playfair">
            <FiHeart className="mr-3 text-pink-500" /> Wishlist Insights
          </h1>
          <p className="text-gray-500 mt-2">See which products your customers love the most and manage wishlisted items.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 flex items-center">
            <FiTrendingUp className="mr-2 text-brand-gold" /> Trending Products
          </h2>
          <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full">
            Total Unique Items Wishlisted: {insights.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                <th className="py-4 px-6 font-semibold">Rank</th>
                <th className="py-4 px-6 font-semibold">Product</th>
                <th className="py-4 px-6 font-semibold">Category</th>
                <th className="py-4 px-6 font-semibold">Wishlist Count</th>
                <th className="py-4 px-6 font-semibold">Latest Add</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {insights.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    No wishlist data available yet.
                  </td>
                </tr>
              ) : (
                insights.map((item, index) => (
                  <tr key={item.product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                          index === 1 ? 'bg-gray-200 text-gray-700' : 
                          index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}`}
                      >
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img src={item.product.image || 'https://via.placeholder.com/50'} alt={item.product.name} className="w-12 h-12 rounded object-cover border border-gray-200" />
                        <div>
                          <p className="font-medium text-gray-800">{item.product.name}</p>
                          <p className="text-sm text-gray-500">₹{item.product.offerPrice || item.product.price}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-brand-cream/30 text-brand-plum text-xs px-2 py-1 rounded">
                        {item.product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-pink-600 font-bold">
                        <FiHeart className="mr-1.5 fill-current" /> {item.count}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(item.latestAdd).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(item.product.id, item.product.name)}
                        disabled={deletingId === item.product.id}
                        title="Delete from Wishlists"
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                      >
                        <FiTrash2 size={18} />
                      </button>
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

export default WishlistInsights;
