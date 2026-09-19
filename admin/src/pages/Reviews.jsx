import { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import productService from '../services/productService';
import { uploadVideoWithProgress } from '../utils/uploadImage';
import { FiTrash2, FiMessageSquare, FiPlus, FiX, FiVideo, FiPlay, FiLoader, FiUploadCloud, FiLink, FiCheckCircle } from 'react-icons/fi';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ productId: '', comment: '', video: '', rating: 5 });
  const [videoMode, setVideoMode] = useState('upload'); // 'upload' or 'url'
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState({ percent: 0, loadedMB: '0', totalMB: '0' });
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');
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

    if (file.size > 100 * 1024 * 1024) {
      alert("Video file size must be under 100MB");
      return;
    }

    // Instant local preview for immediate zero-lag feedback
    const localBlobUrl = URL.createObjectURL(file);
    setPreviewVideoUrl(localBlobUrl);
    setUploadingVideo(true);
    setUploadProgress({ percent: 0, loadedMB: '0', totalMB: (file.size / (1024 * 1024)).toFixed(1) });

    try {
      const result = await uploadVideoWithProgress(file, 'reviews/videos', (prog) => {
        setUploadProgress(prog);
      });

      if (result && result.publicUrl) {
        setFormData(prev => ({ ...prev, video: result.publicUrl }));
        setPreviewVideoUrl(result.publicUrl);
      } else {
        throw new Error(result?.error || 'Video upload failed');
      }
    } catch (err) {
      console.error("Video upload error:", err);
      alert("Video upload issue: " + (err.message || 'Please try again.'));
      setPreviewVideoUrl('');
      setFormData(prev => ({ ...prev, video: '' }));
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleApplyVideoUrl = () => {
    if (!videoUrlInput.trim()) {
      alert("Please enter a valid video URL");
      return;
    }
    const cleanUrl = videoUrlInput.trim();
    setFormData(prev => ({ ...prev, video: cleanUrl }));
    setPreviewVideoUrl(cleanUrl);
  };

  const resetModal = () => {
    setShowModal(false);
    setFormData({ productId: '', comment: '', video: '', rating: 5 });
    setVideoUrlInput('');
    setPreviewVideoUrl('');
    setUploadProgress({ percent: 0, loadedMB: '0', totalMB: '0' });
    setUploadingVideo(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadingVideo) {
      alert("Please wait for the video upload to finish.");
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
      resetModal();
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-playfair flex items-center">
            <FiMessageSquare className="mr-3 text-brand-plum" /> Product Videos & Reviews
          </h1>
          <p className="text-xs text-gray-500 mt-1">Upload high-res product reels and customer reviews directly to CDN & Database.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ productId: '', comment: '', video: '', rating: 5 });
            setVideoUrlInput('');
            setPreviewVideoUrl('');
            setShowModal(true);
          }}
          className="bg-brand-plum text-white px-4 py-2.5 rounded-xl flex items-center shadow-md hover:bg-brand-plum/90 transition-all font-semibold text-sm cursor-pointer"
        >
          <FiPlus className="mr-2" size={18} /> Add Video / Review
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
                    <div className="flex items-center justify-center space-x-2">
                      <FiLoader className="animate-spin text-brand-plum" size={20} />
                      <span className="font-semibold text-sm">Loading records from database...</span>
                    </div>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-3">
                      <FiVideo size={36} className="text-gray-300" />
                      <p className="font-medium">No product videos or reviews added yet.</p>
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
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-brand-cream/20">
              <div>
                <h2 className="text-lg font-bold text-brand-plum flex items-center gap-2">
                  <FiVideo /> Add Product Video & Review
                </h2>
                <p className="text-xs text-gray-500">Fast direct CDN upload with live progress</p>
              </div>
              <button onClick={resetModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer">
                <FiX size={22} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* 1. Select Product */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Select Product *</label>
                <select 
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-plum bg-white text-sm"
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
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Product Description / Review Comment *</label>
                <textarea 
                  required rows="3"
                  placeholder="Enter detailed review or description for this product..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-plum bg-white resize-none text-sm"
                  value={formData.comment}
                  onChange={e => setFormData({...formData, comment: e.target.value})}
                ></textarea>
              </div>

              {/* 3. Video Attachment with Mode Tabs & Progress */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Video Attachment *</label>
                  
                  {/* Mode Switcher */}
                  <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setVideoMode('upload')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        videoMode === 'upload' ? 'bg-white text-brand-plum shadow-xs' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <FiUploadCloud size={12} /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoMode('url')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        videoMode === 'url' ? 'bg-white text-brand-plum shadow-xs' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <FiLink size={12} /> Paste URL
                    </button>
                  </div>
                </div>

                {/* Video Preview if already attached */}
                {formData.video || previewVideoUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-black mt-2 shadow-inner">
                    <video 
                      src={formData.video || previewVideoUrl} 
                      controls 
                      className="w-full h-44 object-cover" 
                    />
                    
                    {/* Upload progress overlay if still uploading in background */}
                    {uploadingVideo && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white">
                        <FiLoader size={28} className="animate-spin text-brand-gold mb-2" />
                        <span className="text-sm font-bold">Uploading: {uploadProgress.percent}%</span>
                        <span className="text-xs text-gray-300 mt-0.5">{uploadProgress.loadedMB} MB / {uploadProgress.totalMB} MB</span>
                        
                        {/* Animated Progress Bar */}
                        <div className="w-48 bg-white/20 rounded-full h-2 mt-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-400 to-green-400 h-full transition-all duration-200"
                            style={{ width: `${uploadProgress.percent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {!uploadingVideo && (
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-green-400 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                        <FiCheckCircle size={12} /> Ready to Save
                      </div>
                    )}

                    <button 
                      type="button" 
                      onClick={() => {
                        setFormData(prev => ({ ...prev, video: '' }));
                        setPreviewVideoUrl('');
                        setVideoUrlInput('');
                      }} 
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md cursor-pointer transition-colors"
                      title="Remove Video"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ) : videoMode === 'upload' ? (
                  <div>
                    <label className="mt-1 cursor-pointer border-2 border-dashed border-gray-300 hover:border-brand-plum rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-brand-cream/10 transition-colors group">
                      {uploadingVideo ? (
                        <div className="flex flex-col items-center gap-2 py-2 w-full px-4">
                          <FiLoader size={26} className="text-brand-plum animate-spin" />
                          <span className="text-xs font-bold text-brand-plum">Uploading: {uploadProgress.percent}% ({uploadProgress.loadedMB}MB / {uploadProgress.totalMB}MB)</span>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                            <div 
                              className="bg-brand-plum h-full transition-all duration-200"
                              style={{ width: `${uploadProgress.percent}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-brand-plum/10 flex items-center justify-center text-brand-plum mb-2 group-hover:scale-110 transition-transform">
                            <FiVideo size={24} />
                          </div>
                          <span className="text-xs font-bold text-gray-700">Click to Select Video (MP4, WebM, MOV)</span>
                          <span className="text-[11px] text-gray-400 mt-1">High-speed direct CDN upload up to 100MB</span>
                          <input 
                            type="file" 
                            accept="video/mp4,video/webm,video/quicktime,video/*" 
                            className="hidden" 
                            onChange={handleVideoUpload} 
                          />
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="space-y-2 mt-1">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://.../video.mp4"
                        className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-plum text-sm"
                        value={videoUrlInput}
                        onChange={e => setVideoUrlInput(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleApplyVideoUrl}
                        className="px-4 py-2 bg-brand-plum text-white text-xs font-bold rounded-xl hover:bg-brand-plum/90 cursor-pointer shadow-xs"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400">Paste any direct Supabase, Cloud, or CDN video URL.</p>
                  </div>
                )}
              </div>

              <div className="pt-3 flex space-x-3">
                <button type="button" onClick={resetModal} className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 cursor-pointer text-sm">
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  disabled={submitting || uploadingVideo} 
                  className="flex-1 py-3 bg-brand-plum text-white font-bold rounded-xl hover:bg-brand-plum/90 disabled:opacity-50 cursor-pointer shadow-md text-sm transition-all"
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
