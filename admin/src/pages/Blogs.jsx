import { useState, useEffect } from 'react';
import blogService from '../services/blogService';
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiX, FiCamera } from 'react-icons/fi';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: '', content: '', author: 'Paidhu Team', image: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await blogService.getAllBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingBlog(null);
    setFormData({ title: '', category: '', content: '', author: 'Paidhu Team', image: '' });
    setShowModal(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      category: blog.category,
      content: blog.content,
      author: blog.author,
      image: blog.image || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingBlog) {
        await blogService.updateBlog(editingBlog.id, formData);
      } else {
        await blogService.createBlog(formData);
      }
      setShowModal(false);
      fetchBlogs();
    } catch (error) {
      alert("Failed to save blog");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await blogService.deleteBlog(id);
        fetchBlogs();
      } catch (error) {
        alert("Failed to delete blog");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-playfair flex items-center">
          <FiFileText className="mr-3 text-brand-plum" /> Blog Management
        </h1>
        <button 
          onClick={openAddModal}
          className="bg-brand-plum text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-brand-plum/90 transition-colors"
        >
          <FiPlus className="mr-2" /> Add Blog Post
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 w-1/4">Blog Image</th>
                <th className="px-6 py-4 w-1/3">Title & Details</th>
                <th className="px-6 py-4 w-1/6">Category</th>
                <th className="px-6 py-4 w-1/6">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-brand-plum">Loading blogs...</td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No blog posts found. Create your first one!</td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {blog.image ? (
                        <img src={blog.image} alt={blog.title} className="w-24 h-16 object-cover rounded shadow-sm border border-gray-200" />
                      ) : (
                        <div className="w-24 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Image</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800 line-clamp-2 mb-1">{blog.title}</div>
                      <div className="text-xs text-gray-400">By {blog.author}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-brand-beige text-brand-plum px-2 py-1 rounded text-xs font-medium uppercase">{blog.category}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(blog)} className="text-blue-500 hover:bg-blue-50 p-2 rounded transition-colors mr-2">
                        <FiEdit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors">
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

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 shrink-0">
              <h2 className="text-xl font-bold text-brand-plum">{editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><FiX size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="blogForm" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Blog Title</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-plum bg-white"
                    placeholder="Enter an engaging headline"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <input 
                      type="text" required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-plum bg-white"
                      placeholder="e.g. Nutrition, Recipes"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Author Name</label>
                    <input 
                      type="text" required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-plum bg-white"
                      value={formData.author}
                      onChange={e => setFormData({...formData, author: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Cover Photo</label>
                  {formData.image ? (
                    <div className="relative inline-block mt-2">
                      <img src={formData.image} alt="Preview" className="h-40 w-auto rounded-lg border border-gray-200 object-cover" />
                      <button type="button" onClick={() => setFormData({...formData, image: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-md hover:bg-red-600"><FiX size={14} /></button>
                    </div>
                  ) : (
                    <label className="mt-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                      <FiCamera size={32} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 font-bold">Click to upload cover photo</span>
                      <span className="text-xs text-gray-400 mt-1">Recommended size: 1200x600px</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Blog Content</label>
                  <textarea 
                    required rows="8"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-plum bg-white resize-y"
                    placeholder="Write your article here..."
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex space-x-3 shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">CANCEL</button>
              <button type="submit" form="blogForm" disabled={submitting} className="flex-1 py-3 bg-brand-plum text-white font-bold rounded-lg hover:bg-brand-plum/90 disabled:opacity-50 transition-colors">
                {submitting ? 'SAVING...' : (editingBlog ? 'UPDATE BLOG' : 'PUBLISH BLOG')}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
