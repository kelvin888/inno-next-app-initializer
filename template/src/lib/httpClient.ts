import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from './config';

/**
 * HTTP Client for API requests
 * Provides a configured axios instance with interceptors
 * Routes through /api/proxy to handle CORS issues
 */
class HttpClient {
    private readonly instance: AxiosInstance;

    constructor() {
        // Use the proxy endpoint instead of direct backend calls
        const baseURL = config.api.useProxy ? config.api.proxyUrl : config.api.baseUrl;

        this.instance = axios.create({
            baseURL,
            timeout: config.api.timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor to add auth token
        this.instance.interceptors.request.use(
            (config: any) => {
                const token = this.getAuthToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for error handling
        this.instance.interceptors.response.use(
            (response: any) => response,
            (error: any) => {
                if (error.response?.status === 401) {
                    this.handleUnauthorized();
                }
                return Promise.reject(error);
            }
        );
    }

    private getAuthToken(): string | null {
        if (globalThis.window !== undefined) {
            return localStorage.getItem(config.auth.tokenKey);
        }
        return null;
    }

    private handleUnauthorized() {
        // Check if we're not already on the login page (root path) to avoid infinite redirects
        if (globalThis.window !== undefined && globalThis.window.location.pathname !== '/') {
            // Clear the auth token
            localStorage.removeItem(config.auth.tokenKey);
            localStorage.removeItem(config.auth.userKey);

            // Dispatch a custom event to notify the app about the forced logout
            // This allows the app to handle navigation using Next.js router
            globalThis.window.dispatchEvent(new CustomEvent('auth:unauthorized'));

            // Note: Navigation should be handled by a global event listener
            // using Next.js router to avoid full page reload
        }
    }

    // HTTP Methods
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.get<T>(url, config);
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.post<T>(url, data, config);
    }

    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.put<T>(url, data, config);
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.delete<T>(url, config);
    }

    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.patch<T>(url, data, config);
    }
}

// Export singleton instance
export const httpClient = new HttpClient();