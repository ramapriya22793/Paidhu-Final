import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/banners';

const getAllBanners = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createBanner = async (bannerData) => {
  const response = await axios.post(API_URL, bannerData);
  return response.data;
};

const updateBanner = async (id, bannerData) => {
  const response = await axios.put(`${API_URL}/${id}`, bannerData);
  return response.data;
};

const deleteBanner = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const bannerService = {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
};

export default bannerService;
