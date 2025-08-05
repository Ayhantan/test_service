// src/services/PostService.ts
import { ApiClient } from '../core/ApiClient';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface CreatePost {
  title: string;
  body: string;
  userId: number;
}

export const PostService = {
  getAll: () => ApiClient.get<Post[]>('/posts'),
  
  getOne: (id: number) => ApiClient.get<Post>(`/posts/${id}`),
  
  getByUser: (userId: number) => ApiClient.get<Post[]>(`/users/${userId}/posts`),
  
  create: (post: CreatePost) => ApiClient.post<Post, CreatePost>('/posts', post),
  
  update: (id: number, data: Partial<Post>) =>
    ApiClient.put<Post, Partial<Post>>(`/posts/${id}`, data),
    
  patch: (id: number, data: Partial<Post>) =>
    ApiClient.patch<Post, Partial<Post>>(`/posts/${id}`, data),
  
  delete: (id: number) => ApiClient.delete(`/posts/${id}`),
  
  // Bulk operations
  bulkCreate: (posts: CreatePost[]) => 
    ApiClient.post<Post[], CreatePost[]>('/posts/bulk', posts),
    
  bulkDelete: (ids: number[]) => 
    ApiClient.post('/posts/bulk-delete', { ids }),

  bulkUpdate: (posts: Partial<Post>[]) =>
  ApiClient.patch<Post[], Partial<Post>[]>('/posts/bulk', posts),

};
