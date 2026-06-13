import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/customers';

const getCustomers = async (timeframe = 'all') => {
  const response = await axios.get(`${API_URL}?timeframe=${timeframe}`);
  return response.data;
};

const customerService = {
  getCustomers
};

export default customerService;
