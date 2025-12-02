const API_URL = '/api';

export const api = {
    getEvents: async () => {
        const res = await fetch(`${API_URL}/events`);
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
    },

    addEvent: async (event: any, token: string) => {
        const res = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(event)
        });
        if (!res.ok) throw new Error('Failed to add event');
        return res.json();
    },

    login: async (credentials: any) => {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!res.ok) throw new Error('Login failed');
        return res.json();
    },

    deleteEvent: async (id: number, token: string) => {
        const res = await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Failed to delete event');
        return res.json();
    },

    updateEvent: async (id: number, event: any, token: string) => {
        const res = await fetch(`${API_URL}/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(event)
        });
        if (!res.ok) throw new Error('Failed to update event');
        return res.json();
    }
};
