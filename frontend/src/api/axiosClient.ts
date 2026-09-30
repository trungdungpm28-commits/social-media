import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000', // Cổng của backend NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm token nếu đã đăng nhập trước đó
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;