import { create } from 'zustand';
import userAuthService from '../services/userAuthService';

export const useUserAuthStore = create((set, get) => ({
    user: null,
    isUserAuthenticated: false,
    isUserLoading: false,
    userError: null,
    isCheckingAuth: true,
    hasInitialized: false,

    // Clear error
    clearUserError: () => set({ userError: null }),

    // Initialize auth check (only once)
    initializeAuth: async () => {
        const { hasInitialized } = get();
        if (hasInitialized) return;
        
        set({ isCheckingAuth: true, hasInitialized: true });
        await get().checkUserAuth();
        set({ isCheckingAuth: false });
    },

    // Register user
    userRegister: async (userData) => {
        set({ isUserLoading: true, userError: null });
        try {
            const response = await userAuthService.register(userData);
            set({
                user: response.user,
                isUserAuthenticated: true,
                isUserLoading: false,
                userError: null,
                hasInitialized: true, // Mark as initialized after successful registration
                isCheckingAuth: false,
            });
            return response;
        } catch (error) {
            set({
                user: null,
                isUserAuthenticated: false,
                isUserLoading: false,
                userError: error.message,
            });
            throw error;
        }
    },

    // Login user
    userLogin: async (email, password) => {
        set({ isUserLoading: true, userError: null });
        try {
            const response = await userAuthService.login(email, password);
            set({
                user: response.user,
                isUserAuthenticated: true,
                isUserLoading: false,
                userError: null,
                hasInitialized: true, // Mark as initialized after successful login
                isCheckingAuth: false,
            });
            return response;
        } catch (error) {
            set({
                user: null,
                isUserAuthenticated: false,
                isUserLoading: false,
                userError: error.message,
            });
            throw error;
        }
    },

    // Logout user
    userLogout: async () => {
        set({ isUserLoading: true, userError: null });
        try {
            await userAuthService.logout();
            set({
                user: null,
                isUserAuthenticated: false,
                isUserLoading: false,
                userError: null,
            });
        } catch (error) {
            set({
                isUserLoading: false,
                userError: error.message,
            });
            throw error;
        }
    },

    // Check auth status
    checkUserAuth: async () => {
        try {
            const response = await userAuthService.checkAuth();
            if (response && response.user) {
                set({
                    user: response.user,
                    isUserAuthenticated: true,
                    userError: null,
                });
                return response;
            } else {
                // Not authenticated or checkAuth returned null
                set({
                    user: null,
                    isUserAuthenticated: false,
                    userError: null,
                });
                return null;
            }
        } catch (error) {
            set({
                user: null,
                isUserAuthenticated: false,
                userError: null, // Don't set error for auth check failures
            });
            return null;
        }
    },
}));
