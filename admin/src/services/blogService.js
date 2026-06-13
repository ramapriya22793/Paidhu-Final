import axios from 'axios';

const API_URL = 'http://localhost:5000/api/blogs';

const getAllBlogs = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getBlogById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createBlog = async (blogData) => {
  const response = await axios.post(API_URL, blogData);
  return response.data;
};

const updateBlog = async (id, blogData) => {
  const response = await axios.put(`${API_URL}/${id}`, blogData);
  return response.data;
};

const deleteBlog = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const blogService = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};

export default blogService;
