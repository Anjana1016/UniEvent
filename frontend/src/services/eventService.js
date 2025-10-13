const API_URL = import.meta.env.VITE_API_URL;

class EventService {
    async addEvent(eventData) {
        try {
            const formData = new FormData();
            
            console.log('Original event data:', eventData); // Debug log
            
            // Append all event data to FormData
            Object.keys(eventData).forEach(key => {
                if (key === 'eventThumbnailImage' && eventData[key] instanceof File) {
                    formData.append(key, eventData[key]);
                } else if (key === 'isFreeEvent') {
                    // Explicitly convert boolean to string
                    formData.append(key, eventData[key].toString());
                } else if (eventData[key] !== undefined && eventData[key] !== null) {
                    formData.append(key, eventData[key]);
                }
            });

            // Debug: Log FormData contents
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await fetch(`${API_URL}/api/events`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add event');
            }

            return data;
        } catch (error) {
            console.error('Add event error:', error);
            throw error;
        }
    }

    async getEvents(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            // Add pagination params
            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);
            
            // Add filter params
            if (params.search) queryParams.append('search', params.search);
            if (params.isFree !== undefined) queryParams.append('isFree', params.isFree);
            if (params.showPast !== undefined) queryParams.append('showPast', params.showPast);

            const response = await fetch(`${API_URL}/api/events?${queryParams}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch events');
            }

            return data;
        } catch (error) {
            console.error('Get events error:', error);
            throw error;
        }
    }

    async getEventById(eventId) {
        try {
            const response = await fetch(`${API_URL}/api/events/${eventId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch event');
            }

            return data;
        } catch (error) {
            console.error('Get event by ID error:', error);
            throw error;
        }
    }

    async deleteEvent(eventId) {
        try {
            const response = await fetch(`${API_URL}/api/events/${eventId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete event');
            }

            return data;
        } catch (error) {
            console.error('Delete event error:', error);
            throw error;
        }
    }
}

export default new EventService();