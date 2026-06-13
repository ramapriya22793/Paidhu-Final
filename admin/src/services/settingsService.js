import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/settings';

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
