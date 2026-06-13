import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiChevronLeft, FiCreditCard, FiUser, FiShoppingBag, FiAlertCircle } from 'react-icons/fi';

const API_URL = 'http://localhost:5000/api/payments';

const PaymentDetails = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Refund Form State
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setPayment(res.data);
      if (res.data.amount) {
        setRefundAmount(res.data.amount);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch payment details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRefund = async (e) => {
    e.preventDefault();
    if (!refundAmount || !refundReason) return alert("Please provide amount and reason.");
    
    setIsProcessing(true);
    try {
      await axios.post(`${API_URL}/${id}/refund`, { refundAmount, reason: refundReason });
      alert("Refund request created!");
      setRefundReason('');
      fetchPayment();
    } catch (error) {
      console.error(error);
      alert("Failed to create refund.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateRefund = async (refundId, status) => {
    setIsProcessing(true);
    try {
      await axios.put(`${API_URL}/refund/${refundId}`, { status });
      alert(`Refund marked as ${status}`);
      fetchPayment();
    } catch (error) {
      console.error(error);
      alert("Failed to update refund.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="p-8 text-brand-plum font-bold">Loading...</div>;
  if (!payment) return <div className="p-8 text-red-500 font-bold">Payment Not Found</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link to="/payments" className="text-gray-500 hover:text-brand-plum flex items-center text-sm font-medium mb-2">
            <FiChevronLeft size={16} className="mr-1" /> Back to Payments
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair flex items-center">
            Transaction Details
            <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              payment.status === 'SUCCESS' || payment.status === 'PAID' ? 'bg-green-100 text-green-700' :
              payment.status === 'REFUNDED' ? 'bg-purple-100 text-purple-700' :
              payment.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {payment.status}
            </span>
          </h1>
          <p className="text-gray-500 text-sm">{payment.razorpayPaymentId || `TXN-COD-${payment.id}`}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center">
              <FiCreditCard className="mr-2 text-brand-plum" /> Gateway Information
            </h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Gateway Name</p>
                <p className="font-medium text-gray-800 mt-1">{payment.gateway}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Payment Method</p>
                <p className="font-medium text-gray-800 mt-1">{payment.method}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Transaction Amount</p>
                <p className="font-bold text-brand-plum text-xl mt-1">₹{payment.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Date & Time</p>
                <p className="font-medium text-gray-800 mt-1">{new Date(payment.createdAt).toLocaleString()}</p>
              </div>
              {payment.razorpayOrderId && (
                <div className="col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Razorpay Order ID</p>
                  <p className="font-mono text-gray-800 text-sm mt-1">{payment.razorpayOrderId}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-3">Razorpay Payment ID</p>
                  <p className="font-mono text-gray-800 text-sm mt-1">{payment.razorpayPaymentId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Refund Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center">
              <FiAlertCircle className="mr-2 text-brand-plum" /> Refund Management
            </h2>
            
            {payment.refunds && payment.refunds.length > 0 ? (
              <div className="space-y-4">
                {payment.refunds.map(refund => (
                  <div key={refund.id} className="border border-purple-100 bg-purple-50/30 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-800">Refund Request #{refund.id}</p>
                        <p className="text-sm text-gray-600 mt-1">Reason: {refund.reason}</p>
                        <p className="text-xs text-gray-500 mt-1">Requested: {new Date(refund.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-plum">₹{refund.refundAmount}</p>
                        <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-bold uppercase ${
                          refund.status === 'PROCESSED' ? 'bg-green-100 text-green-700' :
                          refund.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {refund.status}
                        </span>
                      </div>
                    </div>
                    {refund.status === 'PENDING' && (
                      <div className="flex space-x-2 mt-4 pt-4 border-t border-purple-100">
                        <button 
                          onClick={() => handleUpdateRefund(refund.id, 'APPROVED')}
                          disabled={isProcessing}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          Approve Request
                        </button>
                        <button 
                          onClick={() => handleUpdateRefund(refund.id, 'PROCESSED')}
                          disabled={isProcessing}
                          className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition disabled:opacity-50"
                        >
                          Mark as Processed
                        </button>
                        <button 
                          onClick={() => handleUpdateRefund(refund.id, 'REJECTED')}
                          disabled={isProcessing}
                          className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded hover:bg-red-200 transition disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleCreateRefund} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-600 mb-4">No active refund requests. You can initiate a refund below.</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Refund Amount (₹)</label>
                    <input 
                      type="number" 
                      value={refundAmount} 
                      onChange={(e) => setRefundAmount(e.target.value)}
                      max={payment.amount}
                      className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Reason for Refund</label>
                    <textarea 
                      value={refundReason} 
                      onChange={(e) => setRefundReason(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
                      rows="2"
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={isProcessing || payment.status === 'REFUNDED'}
                    className="w-full py-2 bg-brand-plum text-white font-bold rounded hover:bg-brand-plum/90 transition disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Initiate Refund'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center">
              <FiUser className="mr-2 text-brand-plum" /> Customer Link
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Name</p>
                <p className="font-medium text-gray-800">{payment.order?.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Email</p>
                <p className="text-sm text-gray-600">{payment.order?.customerEmail}</p>
              </div>
              {payment.user && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Registered Account</p>
                  <p className="text-sm text-brand-plum font-medium">USR-{payment.user.id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center">
              <FiShoppingBag className="mr-2 text-brand-plum" /> Order Details
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Order Number</p>
                <Link to={`/orders/${payment.orderId}`} className="font-bold text-brand-plum hover:underline">
                  {payment.order?.orderNumber || `#${payment.orderId}`}
                </Link>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Items Purchased</p>
                {payment.order?.items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 truncate pr-2 flex-1">{item.quantity}x {item.product?.name}</span>
                    <span className="font-medium text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
