// src/core/ApiClient.ts
import { ServiceManager } from './ServiceManager';

export const ApiClient = new ServiceManager('https://jsonplaceholder.typicode.com');

// ÖRNEK: Request interceptor ekle
ApiClient.setRequestInterceptor(async (url, config) => {
  console.log('Request Intercepted:', url, config);
  return [url, config];
});

// ÖRNEK: Response interceptor ekle
ApiClient.setResponseInterceptor(async (response) => {
  console.log('Response Intercepted:', response.status);
  return response;
});
