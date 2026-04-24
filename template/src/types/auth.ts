/**
 * Authentication related type definitions
 */

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    permissions?: string[];
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
    expiresAt: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AuthActions {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    clearAuth: () => void;
    initialize: () => void;
}