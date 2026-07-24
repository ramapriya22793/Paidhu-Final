import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app') + '/api/reviews';

const getAllReviews = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createReview = async (reviewData) => {
  const response = await axios.post(API_URL, reviewData);
  return response.data;
};

const deleteReview = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const reviewService = {
  getAllReviews,
  createReview,
  deleteReview
};

export default reviewService;
