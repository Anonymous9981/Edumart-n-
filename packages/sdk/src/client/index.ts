import type { ApiResponse } from '../types';

export interface ClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  onTokenExpired?: () => void;
  getAccessToken?: () => string | null;
  getRefreshToken?: () => string | null;
  setAccessToken?: (token: string) => void;
  setRefreshToken?: (token: string) => void;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  withCredentials?: boolean;
}

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;
  private getAccessToken: () => string | null;
  private getRefreshToken: () => string | null;
  private setAccessToken: (token: string) => void;
  private setRefreshToken: (token: string) => void;
  private onTokenExpired?: () => void;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 30000;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.getAccessToken = config.getAccessToken || (() => null);
    this.getRefreshToken = config.getRefreshToken || (() => null);
    this.setAccessToken = config.setAccessToken || (() => {});
    this.setRefreshToken = config.setRefreshToken || (() => {});
    this.onTokenExpired = config.onTokenExpired;
  }

  private async request<T>(
    method: string,
    path: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      ...this.headers,
      ...options?.headers,
    };

    // Add auth token if available
    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Build URL with query params
    let finalUrl = url;
    if (options?.params) {
      const params = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      const queryString = params.toString();
      if (queryString) {
        finalUrl += `?${queryString}`;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options?.timeout || this.timeout);

    try {
      const response = await fetch(finalUrl, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        credentials: options?.withCredentials ? 'include' : 'omit',
      });

      clearTimeout(timeoutId);

      // Handle 401 - token expired
      if (response.status === 401) {
        this.onTokenExpired?.();
        throw new Error('Token expired');
      }

      const jsonData: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(jsonData.error?.message || 'Request failed');
      }

      return jsonData.data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T>(path: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, data, options);
  }

  async put<T>(path: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, data, options);
  }

  async patch<T>(path: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, data, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  setDefaultHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  removeDefaultHeader(key: string): void {
    delete this.headers[key];
  }
}
