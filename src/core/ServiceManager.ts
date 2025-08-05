import { ErrorHandler } from './ErrorHandler';

export interface RequestOptions {
  method: string;
  body?: any;
  headers?: Record<string, string>;
  retries?: number;
  timeoutMs?: number;
}

type RequestInterceptor = (url: string, config: RequestInit) => Promise<[string, RequestInit]>;
type ResponseInterceptor = (response: Response) => Promise<Response>;

export class ServiceManager {
  private baseUrl: string;
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  private timeout: number;
  private retries: number;

  private requestInterceptor?: RequestInterceptor;
  private responseInterceptor?: ResponseInterceptor;

  constructor(baseUrl: string, timeout = 10000, retries = 0) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.retries = retries;
  }

  setRequestInterceptor(fn: RequestInterceptor) {
    this.requestInterceptor = fn;
  }

  setResponseInterceptor(fn: ResponseInterceptor) {
    this.responseInterceptor = fn;
  }

  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  private async requestCore<T>(endpoint: string, options: RequestOptions): Promise<T | Headers | void> {
    const retries = options.retries ?? this.retries;
    const timeoutMs = options.timeoutMs ?? this.timeout;

    let attempt = 0;
    let lastError: unknown;

    while (attempt <= retries) {
      const controller = new AbortController();
      let timeoutId: ReturnType<typeof setTimeout> | number = 0;

      try {
        let url = `${this.baseUrl}${endpoint}`;
        let config: RequestInit = {
          method: options.method,
          headers: { ...this.defaultHeaders, ...(options.headers || {}) },
        };

        // === Body ===
        if (
          options.body &&
          !(options.body instanceof FormData) &&
          !['GET', 'HEAD', 'OPTIONS'].includes(options.method)
        ) {
          config.body = JSON.stringify(options.body);
        } else if (options.body instanceof FormData) {
          config.body = options.body;

          const headers = config.headers as Record<string, string>;
          if (headers && headers['Content-Type']) {
            delete headers['Content-Type'];
          }
        }

        // === Request Interceptor ===
        if (this.requestInterceptor) {
          [url, config] = await this.requestInterceptor(url, config);
        }

        // === Timeout ===
        config.signal = controller.signal;
        timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        // === Response Interceptor ===
        let finalResponse = response;
        if (this.responseInterceptor) {
          finalResponse = await this.responseInterceptor(response);
        }

        if (!finalResponse.ok) {
          throw finalResponse; // Native fetch uyumlu: Response nesnesi throw edilir
        }

        if (options.method === 'HEAD' || options.method === 'OPTIONS') {
          return finalResponse.headers;
        }

        if (options.method === 'DELETE') {
          return;
        }

        return (await finalResponse.json()) as T;
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err;

        if (attempt === retries) {
          throw await ErrorHandler.handleApiError(lastError);
        }

        console.warn(`Retry ${attempt + 1}/${retries} because: ${err}`);
        attempt++;
        await new Promise((res) => setTimeout(res, 500));
      }
    }
  }

  // === Axios benzeri public API ===
  request<T>(config: {
    url: string;
    method: string;
    body?: any;
    headers?: Record<string, string>;
    retries?: number;
    timeoutMs?: number;
  }) {
    return this.requestCore<T>(config.url, {
      method: config.method,
      body: config.body,
      headers: config.headers,
      retries: config.retries,
      timeoutMs: config.timeoutMs,
    });
  }

  get<T>(url: string, config?: Partial<RequestOptions>) {
    return this.requestCore<T>(url, { method: 'GET', ...config });
  }

  delete(url: string, config?: Partial<RequestOptions>) {
    return this.requestCore<void>(url, { method: 'DELETE', ...config });
  }

  head(url: string, config?: Partial<RequestOptions>) {
    return this.requestCore<Headers>(url, { method: 'HEAD', ...config });
  }

  options(url: string, config?: Partial<RequestOptions>) {
    return this.requestCore<Headers>(url, { method: 'OPTIONS', ...config });
  }

  post<T, U>(url: string, data?: U, config?: Partial<RequestOptions>) {
    return this.requestCore<T>(url, { method: 'POST', body: data, ...config });
  }

  put<T, U>(url: string, data?: U, config?: Partial<RequestOptions>) {
    return this.requestCore<T>(url, { method: 'PUT', body: data, ...config });
  }

  patch<T, U>(url: string, data?: U, config?: Partial<RequestOptions>) {
    return this.requestCore<T>(url, { method: 'PATCH', body: data, ...config });
  }

  postForm<T>(url: string, data: FormData, config?: Partial<RequestOptions>) {
    return this.requestCore<T>(url, { method: 'POST', body: data, ...config });
  }

  putForm<T>(url: string, data: FormData, config?: Partial<RequestOptions>) {
    return this.requestCore<T>(url, { method: 'PUT', body: data, ...config });
  }

  patchForm<T>(url: string, data: FormData, config?: Partial<RequestOptions>) {
    return this.requestCore<T>(url, { method: 'PATCH', body: data, ...config });
  }
}
