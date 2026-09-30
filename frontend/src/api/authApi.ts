// frontend/src/api/authApi.ts
import axiosClient from './axiosClient';
import type { AuthDto, AuthResponse, UserProfile } from '../types/auth.types';

export const authApi = {
  // Gọi POST /auth/signup
  signup: async (data: AuthDto): Promise<AuthResponse> => {
    const res = await axiosClient.post('/auth/signup', data);
    localStorage.setItem('access_token', res.data.access_token);
    return res.data;
  },

  // Gọi POST /auth/signin
  signin: async (data: AuthDto): Promise<AuthResponse> => {
    const res = await axiosClient.post('/auth/signin', data);
    localStorage.setItem('access_token', res.data.access_token);
    return res.data;
  },

  // Gọi GET /users/me (lấy thông tin user hiện tại)
  getMe: async (): Promise<UserProfile> => {
    const res = await axiosClient.get('/users/me');
    return res.data;
  },

  // Đăng xuất: xóa token
  logout: () => {
    localStorage.removeItem('access_token');
  },
};