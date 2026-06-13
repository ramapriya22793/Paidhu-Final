import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/users';

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/admin-login`, { email, password });
  if (response.data.token) {
    localStorage.setItem('adminToken', response.data.token);
    localStorage.setItem('adminUser', JSON.stringify(response.data.user));
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
