import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import customerService from '../services/customerService';
import { FiArrowLeft, FiUser, FiMapPin, FiPackage, FiHeart, FiPhone, FiMail, FiCalendar } from 'react-icons/fi';

const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const data = await customerService.getCustomerById(id);
      setCustomer(data);
    } catch (error) {
      console.error("Failed to load customer", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading customer details...</div>;
  }

  if (!customer) {
    return <div className="p-6 text-center text-red-500">Customer not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/customers" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <FiArrowLeft size={24} className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 font-playfair flex items-center">
          <span className="bg-brand-plum text-white h-10 w-10 rounded-full flex items-center justify-center mr-3 text-lg">
            {customer.avatar ? <img src={customer.avatar} alt="Avatar" className="h-full w-full object-cover rounded-full" /> : customer.name.charAt(0)}
          </span>
          {customer.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b border-gray-100 pb-3">
            <FiUser className="mr-2 text-brand-plum" /> Profile Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500 text-xs uppercase tracking-wider">Membership</span>
              <span className="font-bold text-brand-gold bg-brand-plum px-2 py-0.5 rounded text-xs tracking-widest">{customer.membershipLevel || 'SILVER'}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <FiMail className="w-5 mr-3 text-gray-400" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <FiPhone className="w-5 mr-3 text-gray-400" />
              <span>{customer.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <FiUser className="w-5 mr-3 text-gray-400" />
              <span>{customer.gender || 'Not provided'}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <FiCalendar className="w-5 mr-3 text-gray-400" />
              <span>{customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-500 text-xs">Reward Points</span>
              <span className="font-bold text-brand-plum">{customer.rewardPoints || 0} pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Language</span>
              <span className="font-medium text-gray-800">{customer.preferredLanguage || 'English'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Referral Code</span>
              <span className="font-bold tracking-widest text-gray-800">{customer.referralCode || 'N/A'}</span>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Joined</p>
              <p className="text-sm font-medium text-gray-700">{new Date(customer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Addresses Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b border-gray-100 pb-3">
            <FiMapPin className="mr-2 text-brand-plum" /> Saved Addresses ({customer.addresses?.length || 0})
          </h2>
          {customer.addresses?.length === 0 ? (
            <p className="text-gray-500 text-sm">No addresses saved.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.addresses.map(address => (
                <div key={address.id} className="border border-gray-100 rounded-lg p-4 relative">
                  {address.isDefault && (
                    <span className="absolute top-2 right-2 bg-brand-gold text-brand-plum text-[10px] uppercase font-bold px-2 py-0.5 rounded">Default</span>
                  )}
                  <p className="font-bold text-sm text-gray-800">{address.fullName} <span className="text-brand-plum text-xs ml-1 bg-brand-plum/10 px-1.5 rounded">{address.addressType}</span></p>
                  <p className="text-xs text-gray-500 mt-1">{address.phone}</p>
                  <p className="text-xs text-gray-600 mt-2">{address.addressLine1}, {address.addressLine2 && address.addressLine2 + ','}</p>
                  <p className="text-xs text-gray-600">{address.city}, {address.state} {address.pincode}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b border-gray-100 pb-3">
            <FiPackage className="mr-2 text-brand-plum" /> Order History ({customer.orders?.length || 0})
          </h2>
          {customer.orders?.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders placed yet.</p>
          ) : (
            <div className="space-y-4">
              {customer.orders.map(order => (
                <div key={order.id} className="flex items-center justify-between border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-plum text-sm">₹{order.totalPrice}</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b border-gray-100 pb-3">
            <FiHeart className="mr-2 text-brand-plum" /> Wishlist ({customer.wishlist?.length || 0})
          </h2>
          {customer.wishlist?.length === 0 ? (
            <p className="text-gray-500 text-sm">Wishlist is empty.</p>
          ) : (
            <div className="space-y-3">
              {customer.wishlist.map(item => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img src={item.product?.image || 'https://via.placeholder.com/50'} alt={item.product?.name} className="h-10 w-10 rounded object-cover border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.product?.name}</p>
                    <p className="text-xs text-brand-plum font-bold">₹{item.product?.offerPrice || item.product?.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
