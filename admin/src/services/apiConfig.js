/**
 * Central API Configuration for Admin Dashboard
 * Ensures API requests always route properly whether running in development or production.
 */

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      return envUrl || 'http://localhost:5000';
    }
    // If not running on localhost (e.g. deployed to Vercel/production), do NOT use localhost backend
    if (!isLocalhost && envUrl && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
      return 'https://paidhu-final-anm2.vercel.app';
    }
  }

  return envUrl || 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

export default {
  getApiBaseUrl,
  API_BASE_URL
};
