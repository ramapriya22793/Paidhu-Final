import axios from 'axios';
import authService from './authService';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/products';

const getProducts = async () => {
  const response = await axios.get(API_URL, { params: { limit: 1000, status: 'all' } });
  return response.data.products || response.data;
};

const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createProduct = async (productData) => {
  const response = await axios.post(API_URL, productData);
  return response.data;
};

const updateProduct = async (id, productData) => {
  const response = await axios.put(`${API_URL}/${id}`, productData);
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;
