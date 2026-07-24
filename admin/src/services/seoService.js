import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/seo';

const getGlobalSeo = async () => {
  const response = await axios.get(API_URL, { params: { _t: new Date().getTime() } });
  return response.data;
};

const getSeoBySlug = async (slug) => {
  const response = await axios.get(`${API_URL}/${slug}`);
  return response.data;
};

const updateSeoBySlug = async (slug, seoData) => {
  const response = await axios.put(`${API_URL}/${slug}`, seoData);
  return response.data;
};

const seoService = {
  getGlobalSeo,
  getSeoBySlug,
  updateSeoBySlug
};

export default seoService;
