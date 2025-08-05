// src/services/SettingsService.ts
import { ApiClient } from '../core/ApiClient';

export interface AppSettings {
  id: number;
  userId: number;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    publicProfile: boolean;
    showEmail: boolean;
    allowMessages: boolean;
  };
  preferences: {
    timezone: string;
    dateFormat: string;
    currency: string;
  };
}

export interface UpdateSettings {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  privacy?: {
    publicProfile?: boolean;
    showEmail?: boolean;
    allowMessages?: boolean;
  };
  preferences?: {
    timezone?: string;
    dateFormat?: string;
    currency?: string;
  };
}

export const SettingsService = {
  // User settings
  getUserSettings: (userId: number) => 
    ApiClient.get<AppSettings>(`/settings/user/${userId}`),
  
  updateUserSettings: (userId: number, settings: UpdateSettings) =>
    ApiClient.put<AppSettings, UpdateSettings>(`/settings/user/${userId}`, settings),
    
  resetUserSettings: (userId: number) =>
    ApiClient.post(`/settings/user/${userId}/reset`, {}),
  
  // Global app settings
  getGlobalSettings: () => ApiClient.get('/settings/global'),
  
  updateGlobalSettings: (settings: Record<string, unknown>) =>
    ApiClient.put('/settings/global', settings),
  
  // Theme management
  getUserTheme: (userId: number) => 
    ApiClient.get<{ theme: string }>(`/settings/user/${userId}/theme`),
    
  updateUserTheme: (userId: number, theme: string) =>
    ApiClient.patch<void, { theme: string }>(`/settings/user/${userId}/theme`, { theme }),
  
  // Notification preferences
  getNotificationSettings: (userId: number) =>
    ApiClient.get(`/settings/user/${userId}/notifications`),
    
  updateNotificationSettings: (userId: number, settings: UpdateSettings['notifications']) =>
    ApiClient.put(`/settings/user/${userId}/notifications`, settings),
  
  // Privacy settings
  getPrivacySettings: (userId: number) =>
    ApiClient.get(`/settings/user/${userId}/privacy`),
    
  updatePrivacySettings: (userId: number, settings: UpdateSettings['privacy']) =>
    ApiClient.put(`/settings/user/${userId}/privacy`, settings),
  
  // System operations
  exportSettings: (userId: number) =>
    ApiClient.get(`/settings/user/${userId}/export`),
    
  importSettings: (userId: number, file: File) => {
    const formData = new FormData();
    formData.append('settings', file);
    return ApiClient.postForm(`/settings/user/${userId}/import`, formData);
  },
};
