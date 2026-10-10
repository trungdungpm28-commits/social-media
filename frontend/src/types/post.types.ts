import type { UserProfile } from './auth.types';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: UserProfile;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  createdAt: string;
  author: UserProfile;
  comments: Comment[];
  likes: { id: number }[];
  _count: { likes: number };
}

export interface CreatePostInput {
  content: string;
  title?: string;
  thumbnail?: string;
}
