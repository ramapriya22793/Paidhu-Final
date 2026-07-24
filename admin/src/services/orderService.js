import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/orders';

const getOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getOrderById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const updateOrderStatus = async (id, statusData) => {
  const response = await axios.put(`${API_URL}/${id}/status`, statusData);
  return response.data;
};

const orderService = {
  getOrders,
  getOrderById,
  updateOrderStatus
};

export default orderService;
