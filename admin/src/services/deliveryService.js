import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/api/delivery-charges`;

const getDeliveryCharges = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createDeliveryCharge = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

const updateDeliveryCharge = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

const deleteDeliveryCharge = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export default {
  getDeliveryCharges,
  createDeliveryCharge,
  updateDeliveryCharge,
  deleteDeliveryCharge
};
