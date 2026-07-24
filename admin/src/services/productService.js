import axios from 'axios';
import authService from './authService';

const API_URL = (import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/products';

const getConfig = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` }
});

const getProducts = async () => {
  const response = await axios.get(API_URL, { 
    ...getConfig(),
    params: { limit: 1000, status: 'all', _t: new Date().getTime() } 
  });
  return response.data.products || response.data;
};

const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getConfig());
  return response.data;
};

const createProduct = async (productData) => {
  const response = await axios.post(API_URL, productData, getConfig());
  return response.data;
};

const updateProduct = async (id, productData) => {
  const response = await axios.put(`${API_URL}/${id}`, productData, getConfig());
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getConfig());
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
