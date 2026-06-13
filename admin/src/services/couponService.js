import axios from 'axios';

const API_URL = 'http://localhost:5000/api/coupons';

const getCoupons = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createCoupon = async (couponData) => {
  const response = await axios.post(API_URL, couponData);
  return response.data;
};

const updateCouponStatus = async (id, isActive) => {
  const response = await axios.put(`${API_URL}/${id}/status`, { isActive });
  return response.data;
};

const deleteCoupon = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const couponService = {
  getCoupons,
  createCoupon,
  updateCouponStatus,
  deleteCoupon
};

export default couponService;
