import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, AuthActions, LoginCredentials } from '@/types/auth';
import { authService } from '@/services/authService';
import { config } from '@/lib/config';

type AuthStore = AuthState & AuthActions;

/**
 * Authentication Store using Zustand
 * Manages user authentication state with persistence
 */
export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => {
            // Listen for unauthorized events from HTTP client
            if (typeof window !== 'undefined') {
                globalThis.window.addEventListener('auth:unauthorized', () => {
                    // Only clear if user is currently authenticated
                    const currentUser = get().user;
                    if (currentUser) {
                        localStorage.removeItem(config.auth.tokenKey);
                        localStorage.removeItem(config.auth.userKey);
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            isLoading: false,
                        });
                    }
                });
            }

            return {
                // Initial state
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,

                // Actions
                login: async (credentials: LoginCredentials) => {
                    set({ isLoading: true });

                    try {
                        const response = await authService.login(credentials);

                        set({
                            user: response.user,
                            token: response.token,
                            isAuthenticated: true,
                            isLoading: false,
                        });

                        // Store in localStorage for persistence
                        localStorage.setItem(config.auth.tokenKey, response.token);
                        localStorage.setItem(config.auth.userKey, JSON.stringify(response.user));

                    } catch (error) {
                        set({ isLoading: false });
                        throw error;
                    }
                },

                logout: () => {
                    // Call logout service (fire and forget)
                    authService.logout().catch(console.warn);

                    // Clear state and storage
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });

                    localStorage.removeItem(config.auth.tokenKey);
                    localStorage.removeItem(config.auth.userKey);

                    // Note: Navigation is handled by useAuth hook using router.push('/')
                    // This keeps the logout function focused on state management only
                },

                setUser: (user) => {
                    set({ user });
                    localStorage.setItem(config.auth.userKey, JSON.stringify(user));
                },

                setToken: (token) => {
                    set({ token, isAuthenticated: true });
                    localStorage.setItem(config.auth.tokenKey, token);
                },

                clearAuth: () => {
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });

                    localStorage.removeItem(config.auth.tokenKey);
                    localStorage.removeItem(config.auth.userKey);
                },

                initialize: () => {
                    // Initialize auth state from localStorage
                    if (globalThis.window !== undefined) {
                        const token = localStorage.getItem(config.auth.tokenKey);
                        const userStr = localStorage.getItem(config.auth.userKey);

                        if (token && userStr) {
                            try {
                                const user = JSON.parse(userStr);
                                set({
                                    user,
                                    token,
                                    isAuthenticated: true,
                                });
                            } catch (error) {
                                // Clear corrupted data
                                localStorage.removeItem(config.auth.tokenKey);
                                localStorage.removeItem(config.auth.userKey);
                            }
                        }
                    }
                },
            };
        },
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);