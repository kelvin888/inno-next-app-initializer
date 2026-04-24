import { httpClient } from '@/lib/httpClient';
import { LoginCredentials, LoginResponse, User } from '@/types/auth';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
    /**
     * Login user with email and password
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await httpClient.post<LoginResponse>('/api/v1/login', credentials);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            await httpClient.post('/auth/logout');
        } catch (error) {
            // Even if logout fails on server, we'll clear local data
            console.warn('Logout request failed:', error);
        }
    }

    /**
     * Get current user profile
     */
    async getProfile(): Promise<User> {
        try {
            const response = await httpClient.get<User>('/auth/profile');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch profile');
        }
    }

    /**
     * Refresh authentication token
     */
    async refreshToken(): Promise<{ token: string; expiresAt: string }> {
        try {
            const response = await httpClient.post('/auth/refresh');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Token refresh failed');
        }
    }

    /**
     * Validate current token
     */
    async validateToken(): Promise<boolean> {
        try {
            await httpClient.get('/auth/validate');
            return true;
        } catch (error) {
            return false;
        }
    }
}

export const authService = new AuthService();