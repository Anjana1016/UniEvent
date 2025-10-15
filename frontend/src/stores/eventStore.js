import { create } from 'zustand';
import eventService from '../services/eventService';
import { toast } from 'sonner';

export const useEventStore = create((set, get) => ({
    events: [],
    isLoading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalEvents: 0,
        hasNextPage: false,
        hasPrevPage: false
    },
    filters: {
        search: '',
        isFree: undefined,
        showPast: false,
        page: 1,
        limit: 10
    },

    // Actions
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),

    // Add event
    addEvent: async (eventData) => {
        try {
            set({ isLoading: true, error: null });
            
            console.log('Store - Adding event with data:', eventData); // Debug log
            
            const response = await eventService.addEvent(eventData);
            
            if (response.success) {
                toast.success(response.message || 'Event added successfully!');
                
                // Refresh the events list to include the new event
                const { fetchEvents, filters } = get();
                await fetchEvents(filters);
                
                return { success: true, data: response.data };
            } else {
                throw new Error(response.message || 'Failed to add event');
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to add event';
            set({ error: errorMessage });
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            set({ isLoading: false });
        }
    },

    // Fetch events
    fetchEvents: async (params = {}) => {
        try {
            set({ isLoading: true, error: null });
            
            const response = await eventService.getEvents(params);
            
            if (response.success) {
                set({
                    events: response.data.events,
                    pagination: response.data.pagination,
                    error: null
                });
                return { success: true, data: response.data };
            } else {
                throw new Error(response.message || 'Failed to fetch events');
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to fetch events';
            set({ error: errorMessage, events: [] });
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            set({ isLoading: false });
        }
    },

    // Fetch single event
    fetchEventById: async (eventId) => {
        try {
            set({ isLoading: true, error: null });
            
            const response = await eventService.getEventById(eventId);
            
            if (response.success) {
                return { success: true, data: response.data };
            } else {
                throw new Error(response.message || 'Failed to fetch event');
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to fetch event';
            set({ error: errorMessage });
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            set({ isLoading: false });
        }
    },

    // Delete event
    deleteEvent: async (eventId) => {
        try {
            set({ isLoading: true, error: null });
            
            const response = await eventService.deleteEvent(eventId);
            
            if (response.success) {
                toast.success(response.message || 'Event deleted successfully!');
                
                // Remove the event from local state
                set((state) => ({
                    events: state.events.filter(event => event._id !== eventId)
                }));
                
                return { success: true };
            } else {
                throw new Error(response.message || 'Failed to delete event');
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to delete event';
            set({ error: errorMessage });
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            set({ isLoading: false });
        }
    },

    // Search events
    searchEvents: async (searchTerm, additionalFilters = {}) => {
        const params = {
            ...get().filters,
            ...additionalFilters,
            search: searchTerm,
            page: 1 // Reset to first page when searching
        };
        
        set({ filters: params });
        return await get().fetchEvents(params);
    },

    // Filter events
    filterEvents: async (filterOptions) => {
        const params = {
            ...get().filters,
            ...filterOptions,
            page: 1 // Reset to first page when filtering
        };
        
        set({ filters: params });
        return await get().fetchEvents(params);
    },

    // Pagination
    goToPage: async (page) => {
        const params = {
            ...get().filters,
            page
        };
        
        set({ filters: params });
        return await get().fetchEvents(params);
    },

    // Reset store
    reset: () => set({
        events: [],
        isLoading: false,
        error: null,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalEvents: 0,
            hasNextPage: false,
            hasPrevPage: false
        },
        filters: {
            search: '',
            isFree: undefined,
            showPast: false,
            page: 1,
            limit: 10
        }
    })
}));