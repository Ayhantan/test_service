// src/config/api.config.ts
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

export const apiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  retries: parseInt(import.meta.env.VITE_API_RETRIES || '3'),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Different environments
export const environments = {
  development: {
    ...apiConfig,
    baseUrl: 'https://jsonplaceholder.typicode.com',
  },
  staging: {
    ...apiConfig,
    baseUrl: 'https://jsonplaceholder.typicode.com',
  },
  production: {
    ...apiConfig,
    baseUrl: 'https://jsonplaceholder.typicode.com',
  },
};

export const getCurrentConfig = (): ApiConfig => {
  const env = import.meta.env.MODE || 'development';
  return environments[env as keyof typeof environments] || environments.development;
};
