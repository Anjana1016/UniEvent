import { create } from 'zustand';
import adminAuthService from '../services/adminAuthService';

export const useAdminAuthStore = create((set, get) => ({
    admin: null,
    isAdminAuthenticated: false,
    isAdminLoading: false,
    adminError: null,
    isCheckingAuth: true,
    hasInitialized: false,

    // Clear error
    clearAdminError: () => set({ adminError: null }),

    // Initialize auth check (only once)
    initializeAuth: async () => {
        const { hasInitialized } = get();
        if (hasInitialized) return;
        
        set({ isCheckingAuth: true, hasInitialized: true });
        await get().checkAdminAuth();
        set({ isCheckingAuth: false });
    },

    // Register admin
    adminRegister: async (adminData) => {
        set({ isAdminLoading: true, adminError: null });
        try {
            const response = await adminAuthService.register(adminData);
            set({
                admin: response.admin,
                isAdminAuthenticated: true,
                isAdminLoading: false,
                adminError: null,
                hasInitialized: true, // Mark as initialized after successful registration
                isCheckingAuth: false,
            });
            return response;
        } catch (error) {
            set({
                admin: null,
                isAdminAuthenticated: false,
                isAdminLoading: false,
                adminError: error.message,
            });
            throw error;
        }
    },

    // Login admin
    adminLogin: async (email, password) => {
        set({ isAdminLoading: true, adminError: null });
        try {
            const response = await adminAuthService.login(email, password);
            set({
                admin: response.admin,
                isAdminAuthenticated: true,
                isAdminLoading: false,
                adminError: null,
                hasInitialized: true, // Mark as initialized after successful login
                isCheckingAuth: false,
            });
            return response;
        } catch (error) {
            set({
                admin: null,
                isAdminAuthenticated: false,
                isAdminLoading: false,
                adminError: error.message,
            });
            throw error;
        }
    },

    // Logout admin
    adminLogout: async () => {
        set({ isAdminLoading: true, adminError: null });
        try {
            await adminAuthService.logout();
            set({
                admin: null,
                isAdminAuthenticated: false,
                isAdminLoading: false,
                adminError: null,
            });
        } catch (error) {
            set({
                isAdminLoading: false,
                adminError: error.message,
            });
            throw error;
        }
    },

    // Check auth status
    checkAdminAuth: async () => {
        try {
            const response = await adminAuthService.checkAuth();
            if (response && response.admin) {
                set({
                    admin: response.admin,
                    isAdminAuthenticated: true,
                    adminError: null,
                });
                return response;
            } else {
                // Not authenticated or checkAuth returned null
                set({
                    admin: null,
                    isAdminAuthenticated: false,
                    adminError: null,
                });
                return null;
            }
        } catch (error) {
            set({
                admin: null,
                isAdminAuthenticated: false,
                adminError: null, // Don't set error for auth check failures
            });
            return null;
        }
    },
}));
