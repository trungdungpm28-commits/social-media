import axiosClient from './axiosClient';
import type { CreatePostInput, Post } from '../types/post.types';

export const postApi = {
  async getFeed(): Promise<Post[]> {
    const response = await axiosClient.get<Post[]>('/post');
    return response.data;
  },

  async create(data: CreatePostInput): Promise<Post> {
    const response = await axiosClient.post<Post>('/post', data);
    return response.data;
  },

  async like(postId: number): Promise<void> {
    await axiosClient.post(`/like/${postId}`);
  },

  async unlike(postId: number): Promise<void> {
    await axiosClient.delete(`/like/${postId}`);
  },
};
