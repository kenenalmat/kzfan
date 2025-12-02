import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import EventGrid from '../components/EventGrid';
import { useEvents } from '../context/EventsContext';

const HomePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { events } = useEvents();
    const { t } = useTranslation();

    const filteredEvents = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return events;

        return events.filter(event =>
            event.location.toLowerCase().includes(query) ||
            event.venue.toLowerCase().includes(query) ||
            event.sport.toLowerCase().includes(query) ||
            event.team.toLowerCase().includes(query) ||
            event.opponent.toLowerCase().includes(query)
        );
    }, [searchQuery, events]);

    return (
        <>
            <Hero searchValue={searchQuery} onSearchChange={setSearchQuery} />

            <div style={{ marginTop: '2rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    padding: '0 0.5rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{t('events.upcoming')}</h2>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        {t('events.results', { count: filteredEvents.length })}
                    </span>
                </div>

                <EventGrid events={filteredEvents} />
            </div>
        </>
    );
};

export default HomePage;
