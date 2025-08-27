import axios from 'axios';

export const profileAPI = axios.create({
  baseURL: 'https://your-backend.com/api', // Replace with your backend
  timeout: 5000,
});
