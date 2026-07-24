import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/customers';

const getCustomers = async (timeframe = 'all') => {
  const response = await axios.get(`${API_URL}?timeframe=${timeframe}`);
  return response.data;
};

const customerService = {
  getCustomers
};

export default customerService;
