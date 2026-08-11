import axios from 'axios';
import authService from './authService';

const API_URL = (import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/seo';

const getConfig = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` }
});

const getGlobalSeo = async () => {
  const response = await axios.get(API_URL, { params: { _t: new Date().getTime() } });
  return response.data;
};

const getSeoBySlug = async (slug) => {
  const response = await axios.get(`${API_URL}/${slug}`);
  return response.data;
};

const updateSeoBySlug = async (slug, seoData) => {
  const response = await axios.put(`${API_URL}/${slug}`, seoData, getConfig());
  return response.data;
};

const getProductSeo = async (productId) => {
  const response = await axios.get(`${API_URL}/products/${productId}`, {
    ...getConfig(),
    params: { _t: new Date().getTime() }
  });
  return response.data;
};

const updateProductSeo = async (productId, seoData) => {
  const response = await axios.put(`${API_URL}/products/${productId}`, seoData, getConfig());
  return response.data;
};

const deleteProductSeo = async (productId) => {
  const response = await axios.delete(`${API_URL}/products/${productId}`, getConfig());
  return response.data;
};

const checkSlugAvailability = async (slug, productId) => {
  const response = await axios.get(`${API_URL}/products/check-slug`, {
    ...getConfig(),
    params: { slug, productId }
  });
  return response.data;
};

const seoService = {
  getGlobalSeo,
  getSeoBySlug,
  updateSeoBySlug,
  getProductSeo,
  updateProductSeo,
  deleteProductSeo,
  checkSlugAvailability
};

export default seoService;
