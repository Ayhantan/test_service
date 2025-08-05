// src/services/CommentService.ts
import { ApiClient } from '../core/ApiClient';

export interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
}

export interface CreateComment {
  name: string;
  email: string;
  body: string;
  postId: number;
}

export const CommentService = {
  getAll: () => ApiClient.get<Comment[]>('/comments'),
  
  getOne: (id: number) => ApiClient.get<Comment>(`/comments/${id}`),
  
  getByPost: (postId: number) => ApiClient.get<Comment[]>(`/posts/${postId}/comments`),
  
  create: (comment: CreateComment) => 
    ApiClient.post<Comment, CreateComment>('/comments', comment),
  
  update: (id: number, data: Partial<Comment>) =>
    ApiClient.put<Comment, Partial<Comment>>(`/comments/${id}`, data),
    
  patch: (id: number, data: Partial<Comment>) =>
    ApiClient.patch<Comment, Partial<Comment>>(`/comments/${id}`, data),
  
  delete: (id: number) => ApiClient.delete(`/comments/${id}`),
  
  // Advanced operations
  getByEmail: (email: string) => 
    ApiClient.get<Comment[]>(`/comments?email=${email}`),
    
  moderate: (id: number, action: 'approve' | 'reject') =>
    ApiClient.patch(`/comments/${id}/moderate`, { action }),
};
