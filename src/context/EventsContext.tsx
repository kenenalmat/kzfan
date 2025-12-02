import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event } from '../data/mockData';
import { api } from '../api';

interface EventsContextType {
    events: Event[];
    addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
    deleteEvent: (id: number) => Promise<void>;
    updateEvent: (id: number, event: Omit<Event, 'id'>) => Promise<void>;
    fetchEvents: () => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<Event[]>([]);

    const fetchEvents = async () => {
        try {
            const data = await api.getEvents();
            setEvents(data);
        } catch (error) {
            console.error('Failed to fetch events', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const addEvent = async (newEvent: Omit<Event, 'id'>) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await api.addEvent(newEvent, token);
            await fetchEvents();
        } catch (error) {
            console.error('Failed to add event', error);
        }
    };

    const deleteEvent = async (id: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await api.deleteEvent(id, token);
            await fetchEvents();
        } catch (error) {
            console.error('Failed to delete event', error);
        }
    };

    const updateEvent = async (id: number, updatedEvent: Omit<Event, 'id'>) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await api.updateEvent(id, updatedEvent, token);
            await fetchEvents();
        } catch (error) {
            console.error('Failed to update event', error);
        }
    };

    return (
        <EventsContext.Provider value={{ events, addEvent, fetchEvents, deleteEvent, updateEvent }}>
            {children}
        </EventsContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventsContext);
    if (context === undefined) {
        throw new Error('useEvents must be used within an EventsProvider');
    }
    return context;
};
