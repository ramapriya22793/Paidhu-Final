import { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import productService from '../services/productService';
import { supabase } from '../utils/supabaseClient';
import { API_BASE_URL } from '../services/apiConfig';
import { FiTrash2, FiMessageSquare, FiPlus, FiX, FiVideo, FiPlay, FiLoader } from 'react-icons/fi';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ productId: '', comment: '', video: '', rating: 5 });
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getAllReviews();
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product video/review?")) {
      try {
        await reviewService.deleteReview(id);
        fetchReviews();
      } catch (error) {
        alert("Failed to delete review.");
      }
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("Video file size must be under 50MB");
      return;
    }

    setUploadingVideo(true);
    try {
      const fileExt = file.name.split('.').pop() || 'mp4';
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '');
      const fileName = `reviews/videos/${Date.now()}-${cleanName}.${fileExt}`;

      // 1. Direct Supabase Storage upload
      if (supabase) {
        const { data, error } = await supabase.storage
          .from('products')
          .upload(fileName, file, {
            contentType: file.type || 'video/mp4',
            cacheControl: '31536000',
            upsert: true
          });

        if (data && !error) {
          const { data: pubData } = supabase.storage.from('products').getPublicUrl(fileName);
          setFormData(prev => ({ ...prev, video: pubData.publicUrl }));
          return;
        }
      }

      // 2. Fallback: Server upload endpoint
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'reviews/videos');
      const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success && json.publicUrl) {
        setFormData(prev => ({ ...prev, video: json.publicUrl }));
      } else {
        throw new Error(json.error || 'Upload failed');
      }
    } catch (err) {
      console.error("Video upload error:", err);
      alert("Failed to upload video: " + (err.message || 'Please try again.'));
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadingVideo) {
      alert("Please wait for the video to finish uploading.");
      return;
    }
    if (!formData.productId) {
      alert("Please select a product.");
      return;
    }
    if (!formData.comment && !formData.video) {
      alert("Please provide a description or attach a video.");
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.createReview({
        productId: Number(formData.productId),
        comment: formData.comment,
        video: formData.video,
        rating: 5,
        reviewerName: 'Verified Product Review'
      });
      setShowModal(false);
      setFormData({ productId: '', comment: '', video: '', rating: 5 });
      fetchReviews();
      alert("Video review saved to database successfully!");
    } catch (error) {
      console.error("Failed to create review", error);
      alert("Failed to save to database: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-playfair flex items-center">
          <FiMessageSquare className="mr-3 text-brand-plum" /> Product Videos & Reviews
        </h1>
        <button 
          onClick={() => {
            setFormData({ productId: '', comment: '', video: '', rating: 5 });
            setShowModal(true);
          }}
          className="bg-brand-plum text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-brand-plum/90 transition-colors"
        >
          <FiPlus className="mr-2" /> Add Video / Review
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 w-1/4">Product</th>
                <th className="px-6 py-4 w-1/3">Description</th>
                <th className="px-6 py-4 w-1/4">Video Attachment</th>
                <th className="px-6 py-4 w-1/6">Date Added</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-brand-plum">
                    Loading records from database...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-3">
                      <FiVideo size={32} className="text-gray-300" />
                      <p>No product videos or reviews added yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {rev.product?.image ? (
                          <img src={rev.product.image} alt={rev.product.name} className="w-12 h-12 object-contain bg-gray-50 rounded-lg border border-gray-200" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">No Img</div>
                        )}
                        <span className="font-semibold text-gray-800 line-clamp-2">{rev.product?.name || "Product #" + rev.productId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <p className="line-clamp-3 text-sm" title={rev.comment}>{rev.comment || "(No description provided)"}</p>
                    </td>
                    <td className="px-6 py-4">
                      {rev.video ? (
                        <div className="flex items-center space-x-2">
                          <video 
                            src={rev.video} 
                            controls 
                            className="w-32 h-20 rounded-lg bg-black object-cover shadow-sm border border-gray-200"
                            preload="metadata"
                          />
                        </div>
                      ) : rev.image ? (
                        <img src={rev.image} alt="Attachment" className="h-16 w-auto rounded border border-gray-200 object-cover" />
                      ) : (
                        <span className="text-xs text-gray-400">No video attached</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(rev.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                        title="Delete"
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

      {/* ADD PRODUCT VIDEO & REVIEW MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-brand-plum">Add Product Video & Description</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><FiX size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* 1. Select Product */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Product *</label>
                <select 
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-plum bg-white text-sm"
                  value={formData.productId}
                  onChange={e => setFormData({...formData, productId: e.target.value})}
                >
                  <option value="">-- Choose a product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* 2. Product Description / Review */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Description / Review Comment *</label>
                <textarea 
                  required rows="3"
                  placeholder="Enter detailed review or description for this product..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-plum bg-white resize-none text-sm"
                  value={formData.comment}
                  onChange={e => setFormData({...formData, comment: e.target.value})}
                ></textarea>
              </div>

              {/* 3. Video Attachment */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Video Attachment *</label>
                {formData.video ? (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-black mt-2">
                    <video src={formData.video} controls className="w-full h-44 object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, video: ''})} 
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow hover:bg-red-700"
                      title="Remove Video"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="mt-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    {uploadingVideo ? (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <FiLoader size={24} className="text-brand-plum animate-spin" />
                        <span className="text-xs font-bold text-brand-plum">Uploading video to database storage...</span>
                      </div>
                    ) : (
                      <>
                        <FiVideo size={26} className="text-brand-plum mb-1" />
                        <span className="text-xs font-bold text-gray-700">Click to Upload Video (MP4, WebM, MOV)</span>
                        <span className="text-[11px] text-gray-400 mt-0.5">Directly saved into DB and CDN storage</span>
                        <input 
                          type="file" 
                          accept="video/mp4,video/webm,video/quicktime,video/*" 
                          className="hidden" 
                          onChange={handleVideoUpload} 
                        />
                      </>
                    )}
                  </label>
                )}
              </div>

              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50">CANCEL</button>
                <button 
                  type="submit" 
                  disabled={submitting || uploadingVideo} 
                  className="flex-1 py-3 bg-brand-plum text-white font-bold rounded-lg hover:bg-brand-plum/90 disabled:opacity-50"
                >
                  {submitting ? 'SAVING TO DB...' : 'SAVE REVIEW & VIDEO'}
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
