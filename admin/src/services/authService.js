import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/users`;

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/admin-login`, { email, password });
  if (response.data.token) {
    localStorage.setItem('adminToken', response.data.token);
    const userData = response.data.user || {};
    if (response.data.mustChangePassword) {
      userData.mustChangePassword = true;
    }
    localStorage.setItem('adminUser', JSON.stringify(userData));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('adminUser');
  return user ? JSON.parse(user) : null;
};

const getToken = () => {
  return localStorage.getItem('adminToken');
};

export default {
  login,
  logout,
  getCurrentUser,
  getToken
};
