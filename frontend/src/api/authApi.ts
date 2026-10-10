// frontend/src/api/authApi.ts
import axiosClient from './axiosClient';
import type { AuthDto, AuthResponse, UserProfile } from '../types/auth.types';

export const authApi = {
  signup: async (data: AuthDto): Promise<AuthResponse> => {
    const res = await axiosClient.post('/auth/signup', data);
    sessionStorage.setItem('access_token', res.data.access_token);
    return res.data;
  },

  signin: async (data: AuthDto): Promise<AuthResponse> => {
    const res = await axiosClient.post('/auth/signin', data);
    sessionStorage.setItem('access_token', res.data.access_token);
    return res.data;
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await axiosClient.get('/users/me');
    return res.data;
  },

  logout: () => {
    sessionStorage.removeItem('access_token');
  },
};