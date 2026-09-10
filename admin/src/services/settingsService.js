import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/settings`;

const getSettings = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const updateSettings = async (settingsData) => {
  const response = await axios.put(API_URL, settingsData);
  return response.data;
};

const settingsService = {
  getSettings,
  updateSettings,
};

export default settingsService;
