export interface RequestOptions {
  method: string;
  body?: any;
  headers?: Record<string, string>;  // Sadece nesne kullanacağız
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

  private requestInterceptor?: RequestInterceptor;
  private responseInterceptor?: ResponseInterceptor;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
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
    const retries = options.retries ?? 0;
    const timeoutMs = options.timeoutMs ?? 10000;

    let attempt = 0;
    while (attempt <= retries) {
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

          //TypeScript için headers tipini kesinleştir
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
        const controller = new AbortController();
        config.signal = controller.signal;
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, config);
        clearTimeout(timeout);

        // === Response Interceptor ===
        let finalResponse = response;
        if (this.responseInterceptor) {
          finalResponse = await this.responseInterceptor(response);
        }

        if (!finalResponse.ok) {
          throw new Error(`${options.method} failed: ${finalResponse.status} ${finalResponse.statusText}`);
        }

        if (options.method === 'HEAD' || options.method === 'OPTIONS') {
          return finalResponse.headers;
        }

        if (options.method === 'DELETE') {
          return;
        }

        return (await finalResponse.json()) as T;

      } catch (err) {
        if (attempt === retries) throw err;
        console.warn(`Retry ${attempt + 1}/${retries} due to: ${err}`);
        attempt++;
        await new Promise((res) => setTimeout(res, 500));
      }
    }
  }

  //  Axois benzeri Public API
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

  //form data dosya binary ect. 
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
