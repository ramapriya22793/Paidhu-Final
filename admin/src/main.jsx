import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import authService from './services/authService'

// Global Axios Interceptors
axios.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If request failed due to Network Error when attempting localhost:5000 (e.g. local backend isn't running),
    // automatically retry against the live production backend so the admin panel continues working seamlessly!
    if (
      (!error.response || error.code === 'ERR_NETWORK') &&
      error.config &&
      !error.config.__isFallbackRetry &&
      error.config.url &&
      (error.config.url.includes('localhost:5000') || error.config.url.includes('127.0.0.1:5000'))
    ) {
      console.warn('Local server unreachable on localhost:5000. Seamlessly retrying with live API (paidhu-final-anm2.vercel.app)...');
      error.config.__isFallbackRetry = true;
      error.config.url = error.config.url
        .replace('http://localhost:5000', 'https://paidhu-final-anm2.vercel.app')
        .replace('http://127.0.0.1:5000', 'https://paidhu-final-anm2.vercel.app');
      return axios(error.config);
    }

    if (error.response && error.response.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
