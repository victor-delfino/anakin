// ============================================
// SERVICES - API Client
// ============================================

import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30s para acomodar tempo de resposta da IA
    });

    // Interceptor para logging
    this.client.interceptors.request.use((config) => {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    // Interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse<unknown>>) => {
        const message = error.response?.data?.error || error.message || 'Erro desconhecido';
        console.error('[API Error]', message);
        return Promise.reject(new Error(message));
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Request failed');
    }
    return response.data.data as T;
  }

  async post<T, D = unknown>(url: string, data?: D): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Request failed');
    }
    return response.data.data as T;
  }
}

export const api = new ApiClient();
