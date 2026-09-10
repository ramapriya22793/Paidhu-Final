import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/customers`;

const getCustomers = async (timeframe = 'all') => {
  const response = await axios.get(`${API_URL}?timeframe=${timeframe}`);
  return response.data;
};

const customerService = {
  getCustomers
};

export default customerService;
