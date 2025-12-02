import React from 'react';
import { useTranslation } from 'react-i18next';
import EventCard from './EventCard';
import { Event } from '../data/mockData';

interface EventGridProps {
    events: Event[];
}

const EventGrid: React.FC<EventGridProps> = ({ events }) => {
    const { t } = useTranslation();

    if (events.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: 'var(--color-text-muted)'
            }}>
                <p style={{ fontSize: '1.25rem' }}>{t('events.noEvents')}</p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            padding: '2rem 0'
        }}>
            {events.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
};

export default EventGrid;
