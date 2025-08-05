import { ServiceManager } from './ServiceManager';
import { getCurrentConfig } from '../config/api.config';

const config = getCurrentConfig();

export const ApiClient = new ServiceManager(config.baseUrl, config.timeout, config.retries);

ApiClient.setRequestInterceptor(async (url, config) => {
  // Örneğin JWT token ekle
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return [url, config];
});

ApiClient.setResponseInterceptor(async (response) => {
  console.log(`[Response] ${response.status} ${response.url}`);
  return response;
});
