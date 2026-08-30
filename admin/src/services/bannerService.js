import axios from 'axios';
import authService from './authService';

const API_URL = (import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/banners';

const getConfig = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` }
});

const getAllBanners = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

const createBanner = async (bannerData) => {
  const response = await axios.post(API_URL, bannerData, getConfig());
  return response.data;
};

const updateBanner = async (id, bannerData) => {
  const response = await axios.put(`${API_URL}/${id}`, bannerData, getConfig());
  return response.data;
};

const deleteBanner = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getConfig());
  return response.data;
};

const bannerService = {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
};

export default bannerService;
