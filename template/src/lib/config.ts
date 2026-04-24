/**
 * Application configuration management
 * Centralized configuration for API endpoints, timeouts, and app settings
 */

export const config = {
    // API Configuration
    api: {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001',
        timeout: Number.parseInt(process.env.NEXT_PUBLIC_TIMEOUT || '30000'),
        useProxy: process.env.NEXT_PUBLIC_USE_PROXY === 'true',
        proxyUrl: '/api/proxy',
    },

    // Application Settings
    app: {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'Admin Dashboard',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    },

    // Authentication Configuration
    auth: {
        jwtExpiry: Number.parseInt(process.env.NEXT_PUBLIC_JWT_EXPIRY || '3600'),
        sessionTimeout: Number.parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '1800'),
        tokenKey: 'auth_token',
        userKey: 'auth_user',
    },

    // Development Settings
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
} as const;

export type AppConfig = typeof config;