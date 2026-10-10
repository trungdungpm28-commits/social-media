import axiosClient from './axiosClient';
import type { Comment } from '../types/post.types';

export const commentApi = {
  async getForPost(postId: number): Promise<Comment[]> {
    const response = await axiosClient.get<Comment[]>(`/comment/post/${postId}`);
    return response.data;
  },

  async create(postId: number, content: string): Promise<Comment> {
    const response = await axiosClient.post<Comment>(`/comment/${postId}`, {
      content,
    });
    return response.data;
  },
};
