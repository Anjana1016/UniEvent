const API_URL = import.meta.env.VITE_API_URL;

class AdminDashboardService {
    async getDashboardStats() {
        try {
            const response = await fetch(`${API_URL}/api/admin/dashboard-stats`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get dashboard stats');
            }

            return data;
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            throw error;
        }
    }

    // Add more admin dashboard related methods here
    async getRecentEvents(limit = 5) {
        try {
            const response = await fetch(`${API_URL}/api/admin/recent-events?limit=${limit}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get recent events');
            }

            return data;
        } catch (error) {
            console.error('Get recent events error:', error);
            throw error;
        }
    }
}

export default new AdminDashboardService();