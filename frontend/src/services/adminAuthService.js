const API_URL = import.meta.env.VITE_API_URL;

class AdminAuthService {
    async register(adminData) {
        try {
            const response = await fetch(`${API_URL}/api/adminAuth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(adminData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            return data;
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/api/adminAuth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            return data;
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    }

    async logout() {
        try {
            const response = await fetch(`${API_URL}/api/adminAuth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Logout failed');
            }

            return data;
        } catch (error) {
            throw new Error(error.message || 'Logout failed');
        }
    }

    async checkAuth() {
        try {
            const response = await fetch(`${API_URL}/api/adminAuth/check-auth`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status === 401) {
                // 401 is expected when not authenticated, not an error
                return null;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication check failed');
            }

            return data;
        } catch (error) {
            // Only throw for network errors or server errors, not authentication failures
            if (error.message.includes('fetch')) {
                throw error;
            }
            return null;
        }
    }
}

export default new AdminAuthService();
