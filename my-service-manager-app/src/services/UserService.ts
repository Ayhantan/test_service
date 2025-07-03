// src/services/UserService.ts
//Özel servis doyası 
import { ApiClient } from '../core/ApiClient';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const UserService = {
  getOne: (id: number) => ApiClient.get<User>(`/users/${id}`),

  getAll: () => ApiClient.get<User[]>('/users'),

  create: (user: Omit<User, 'id'>) => ApiClient.post<User, Omit<User, 'id'>>('/users', user),

  update: (id: number, data: Partial<User>) =>
    ApiClient.put<User, Partial<User>>(`/users/${id}`, data),

  delete: (id: number) => ApiClient.delete(`/users/${id}`),

  // Auth
  login: (credentials: { email: string; password: string }) =>
    ApiClient.post('/auth/login', credentials),

  logout: () => ApiClient.post('/auth/logout'),

  refreshToken: () => ApiClient.post('/auth/refresh'),

    // Profil
  getProfile: () => ApiClient.get('/users/me'),
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    ApiClient.post('/users/change-password', data),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    return ApiClient.postForm('/users/me/avatar', form);
  },

  // Yetki/Rol
  assignRole: (userId: number, roleId: number) =>
    ApiClient.post(`/users/${userId}/roles`, { roleId }),
  getRoles: (userId: number) => ApiClient.get(`/users/${userId}/roles`),

  // Durum
  toggleActive: (userId: number, isActive: boolean) =>
    ApiClient.patch(`/users/${userId}/status`, { isActive }),
};