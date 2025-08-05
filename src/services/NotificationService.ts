// src/services/NotificationService.ts
import { ApiClient } from '../core/ApiClient';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  userId?: number;
}

export interface CreateNotification {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  userId?: number;
}

export const NotificationService = {
  // Simulated notification endpoints
  getAll: () => ApiClient.get<Notification[]>('/notifications'),
  
  getOne: (id: number) => ApiClient.get<Notification>(`/notifications/${id}`),
  
  getUnread: () => ApiClient.get<Notification[]>('/notifications/unread'),
  
  getByType: (type: string) => ApiClient.get<Notification[]>(`/notifications/type/${type}`),
  
  create: (notification: CreateNotification) => 
    ApiClient.post<Notification, CreateNotification>('/notifications', notification),
  
  markAsRead: (id: number) => 
    ApiClient.patch<Notification, { read: boolean }>(`/notifications/${id}/read`, { read: true }),
    
  markAllAsRead: () => 
    ApiClient.patch('/notifications/mark-all-read', {}),
  
  delete: (id: number) => ApiClient.delete(`/notifications/${id}`),
  
  deleteAll: () => ApiClient.delete('/notifications/all'),
  
  // Advanced operations
  getStats: () => ApiClient.get('/notifications/stats'),
  
  subscribe: (topic: string) => 
    ApiClient.post('/notifications/subscribe', { topic }),
    
  unsubscribe: (topic: string) => 
    ApiClient.post('/notifications/unsubscribe', { topic }),
};
