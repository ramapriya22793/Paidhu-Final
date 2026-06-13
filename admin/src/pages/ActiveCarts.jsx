import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiShoppingCart, FiUser, FiClock } from 'react-icons/fi';

const ActiveCarts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/cart/admin/all', {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        setCarts(res.data);
      } catch (error) {
        console.error('Failed to fetch active carts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCarts();
  }, []);

  if (loading) {
    return <div className="p-8 text-brand-plum flex items-center space-x-2">
      <div className="w-5 h-5 border-2 border-brand-plum border-t-transparent rounded-full animate-spin"></div>
      <span>Loading active carts...</span>
    </div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-800">Active Carts</h1>
          <p className="text-gray-500 mt-1">Monitor live carts and potentially abandoned checkouts in real-time.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-2">
          <FiShoppingCart className="text-brand-plum" />
          <span className="font-bold text-gray-800">{carts.length} Active Carts</span>
        </div>
      </div>

      {carts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <FiShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl font-medium text-gray-600">No active carts at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {carts.map((cart) => {
            const timeAgo = new Date(cart.lastUpdated).toLocaleString();
            return (
              <div key={cart.user.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                {/* User Info Header */}
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-brand-plum/10 rounded-full flex items-center justify-center text-brand-plum font-bold text-lg">
                      {cart.user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 flex items-center">
                        <FiUser className="mr-2 text-gray-400" />
                        {cart.user.name}
                      </h3>
                      <p className="text-sm text-gray-500">{cart.user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Total Value</p>
                    <p className="text-xl font-bold text-brand-plum">₹{cart.totalValue.toFixed(2)}</p>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-white" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-gray-500">{item.product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">x{item.quantity}</p>
                        <p className="text-xs font-semibold text-brand-gold">
                          ₹{((item.product.offerPrice || item.product.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Time */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                  <div className="flex items-center">
                    <FiClock className="mr-1" /> Last Updated: {timeAgo}
                  </div>
                  <span className="bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded">In Progress</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveCarts;
