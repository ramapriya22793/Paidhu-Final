import axios from 'axios';

const API_URL = 'http://localhost:5000/api/seo';

const getGlobalSeo = async () => {
  const response = await axios.get(API_URL);
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
