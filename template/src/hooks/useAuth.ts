import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { LoginCredentials } from '@/types/auth';

/**
 * Authentication Hook
 * Provides authentication state and actions
 */
export function useAuth() {
    const router = useRouter();
    const {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout: logoutStore,
        initialize,
        clearAuth,
    } = useAuthStore();

    // Initialize auth on mount
    useEffect(() => {
        initialize();
    }, [initialize]);

    // Helper functions
    const loginUser = async (credentials: LoginCredentials) => {
        try {
            await login(credentials);
            // Navigate to dashboard after successful login
            router.push('/dashboard');
        } catch (error) {
            throw error;
        }
    };

    const logoutUser = useCallback(() => {
        // Clear auth state (store handles cleanup)
        logoutStore();

        // Navigate to login page using Next.js router (no page reload)
        router.push('/');
    }, [logoutStore, router]);

    const hasPermission = (permission: string): boolean => {
        return user?.permissions?.includes(permission) || false;
    };

    const hasRole = (role: string): boolean => {
        return user?.role === role;
    };

    return {
        // State
        user,
        token,
        isAuthenticated,
        isLoading,

        // Actions
        login: loginUser,
        logout: logoutUser,
        clearAuth,

        // Helpers
        hasPermission,
        hasRole,
    };
}