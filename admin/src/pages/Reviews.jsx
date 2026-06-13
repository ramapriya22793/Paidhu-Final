import { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import productService from '../services/productService';
import { FiStar, FiTrash2, FiMessageSquare, FiPlus, FiX, FiCamera } from 'react-icons/fi';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ productId: '', reviewerName: '', rating: 5, comment: '', image: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      try {
        await reviewService.deleteReview(id);
        fetchReviews(); // Refresh the list
      } catch (error) {
        alert("Failed to delete review.");
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reviewService.createReview(formData);
      setShowModal(false);
      setFormData({ productId: '', reviewerName: '', rating: 5, comment: '', image: '' });
      fetchReviews();
    } catch (error) {
      alert("Failed to create review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-playfair flex items-center">
          <FiMessageSquare className="mr-3 text-brand-plum" /> Customer Reviews
        </h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand-plum text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-brand-plum/90 transition-colors"
        >
          <FiPlus className="mr-2" /> Add Review
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 w-1/4">Product</th>
                <th className="px-6 py-4 w-1/5">Reviewer</th>
                <th className="px-6 py-4 w-1/6">Rating</th>
                <th className="px-6 py-4 w-1/3">Comment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-brand-plum">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-3">
                      <FiStar size={32} className="text-gray-300" />
                      <p>No reviews have been submitted yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {rev.product?.image ? (
                          <img src={rev.product.image} alt={rev.product.name} className="w-10 h-10 object-contain bg-gray-50 rounded" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
                        )}
                        <span className="font-semibold text-gray-800 line-clamp-2">{rev.product?.name || "Unknown Product"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{rev.reviewerName}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(rev.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-brand-gold">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className={i < rev.rating ? "fill-current" : "text-gray-300"} size={14} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <p className="line-clamp-2 mb-3" title={rev.comment}>{rev.comment}</p>
                      {rev.image && (
                        <div className="mt-2">
                          <img src={rev.image} alt="Attached by customer" className="h-20 w-auto rounded border border-gray-200 object-cover hover:scale-150 transition-transform origin-left cursor-zoom-in" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(rev.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                        title="Delete Review"
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

      {/* CREATE REVIEW MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-brand-plum">Create Customer Review</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><FiX size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Product</label>
                <select 
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-plum bg-white"
                  value={formData.productId}
                  onChange={e => setFormData({...formData, productId: e.target.value})}
                >
                  <option value="">-- Choose a product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Customer Name</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-plum bg-white"
                  value={formData.reviewerName}
                  onChange={e => setFormData({...formData, reviewerName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Rating (1-5)</label>
                <div className="flex space-x-2 text-2xl text-gray-300 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar 
                      key={star} 
                      onClick={() => setFormData({...formData, rating: star})}
                      className={star <= formData.rating ? "text-brand-gold fill-current" : ""} 
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Review Comment</label>
                <textarea 
                  required rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-plum bg-white resize-none"
                  value={formData.comment}
                  onChange={e => setFormData({...formData, comment: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Attach Photo (Optional)</label>
                {formData.image ? (
                  <div className="relative inline-block mt-2">
                    <img src={formData.image} alt="Preview" className="h-20 w-auto rounded border border-gray-200" />
                    <button type="button" onClick={() => setFormData({...formData, image: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><FiX size={12} /></button>
                  </div>
                ) : (
                  <label className="mt-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100">
                    <FiCamera size={20} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Upload Photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50">CANCEL</button>
                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-brand-plum text-white font-bold rounded-lg hover:bg-brand-plum/90 disabled:opacity-50">
                  {submitting ? 'SAVING...' : 'ADD REVIEW'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
