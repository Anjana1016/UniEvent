import { create } from 'zustand';
import adminDashboardService from '../services/adminDashboardService';
import { toast } from 'sonner';

export const useAdminStore = create((set, get) => ({
    // Dashboard stats state
    dashboardStats: {
        totalEvents: 0,
        totalUsers: 0,
        freeEvents: 0,
        paidEvents: 0,
        eventsThisMonth: 0
    },
    recentEvents: [],
    isLoading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    // Fetch dashboard stats
    fetchDashboardStats: async () => {
        try {
            set({ isLoading: true, error: null });
            console.log('Fetching dashboard stats...');
            
            const response = await adminDashboardService.getDashboardStats();
            console.log('Dashboard stats response:', response);
            
            if (response.success) {
                set({ dashboardStats: response.data });
                console.log('Dashboard stats updated:', response.data);
                return { success: true, data: response.data };
            } else {
                throw new Error(response.message || 'Failed to fetch dashboard stats');
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to fetch dashboard stats';
            set({ error: errorMessage });
            console.error('Fetch dashboard stats error:', errorMessage);
            toast.error(`Dashboard stats error: ${errorMessage}`);
            return { success: false, error: errorMessage };
        } finally {
            set({ isLoading: false });
        }
    },

    // Fetch recent events
    fetchRecentEvents: async (limit = 5) => {
        try {
            set({ isLoading: true, error: null });
            console.log('Fetching recent events with limit:', limit);
            
            const response = await adminDashboardService.getRecentEvents(limit);
            console.log('Recent events response:', response);
            
            if (response.success) {
                const events = response.data.events || [];
                console.log('Setting recent events:', events);
                set({ recentEvents: events });
                return { success: true, data: response.data };
            } else {
                throw new Error(response.message || 'Failed to fetch recent events');
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to fetch recent events';
            set({ error: errorMessage });
            console.error('Fetch recent events error:', errorMessage);
            toast.error(`Recent events error: ${errorMessage}`);
            return { success: false, error: errorMessage };
        } finally {
            set({ isLoading: false });
        }
    },

    // Reset store
    reset: () => set({
        dashboardStats: {
            totalEvents: 0,
            totalUsers: 0,
            freeEvents: 0,
            paidEvents: 0,
            eventsThisMonth: 0
        },
        recentEvents: [],
        isLoading: false,
        error: null
    })
}));