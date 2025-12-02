import React, { useState } from 'react';
import { useEvents } from '../context/EventsContext';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
    const { addEvent, deleteEvent, updateEvent, events } = useEvents();
    const navigate = useNavigate();
    const [editingId, setEditingId] = React.useState<number | null>(null);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        sport: '',
        team: '',
        opponent: '',
        date: '',
        location: '',
        venue: '',
        imageUrl: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addEvent(formData);
        navigate('/');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text)',
        marginBottom: '1rem'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        color: 'var(--color-text-muted)',
        fontSize: '0.875rem'
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 700 }}>Add New Event</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label style={labelStyle}>Sport</label>
                    <input
                        name="sport"
                        value={formData.sport}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                        placeholder="e.g. Football"
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Team</label>
                        <input
                            name="team"
                            value={formData.team}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                            placeholder="e.g. Kazakhstan"
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Opponent</label>
                        <input
                            name="opponent"
                            value={formData.opponent}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                            placeholder="e.g. France"
                        />
                    </div>
                </div>
                <div>
                    <label style={labelStyle}>Date & Time</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                </div>
                <div>
                    <label style={labelStyle}>Location</label>
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                        placeholder="e.g. Paris, France"
                    />
                </div>
                <div>
                    <label style={labelStyle}>Venue</label>
                    <input
                        name="venue"
                        value={formData.venue}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                        placeholder="e.g. Stade de France"
                    />
                </div>
                <div>
                    <label style={labelStyle}>Image URL</label>
                    <input
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                        placeholder="https://..."
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        marginTop: '1rem'
                    }}
                >
                    Add Event
                </button>
            </form>

            <div style={{ marginTop: '4rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Manage Events</h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {events.map(event => (
                        <div key={event.id} style={{
                            padding: '1rem',
                            backgroundColor: 'var(--color-surface)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            {editingId === event.id ? (
                                <EditEventForm
                                    event={event}
                                    onSave={(updated) => {
                                        updateEvent(event.id, updated);
                                        setEditingId(null);
                                    }}
                                    onCancel={() => setEditingId(null)}
                                />
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{event.team} vs {event.opponent}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                            {new Date(event.date).toLocaleDateString()} • {event.location}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => setEditingId(event.id)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                backgroundColor: 'rgba(0, 175, 202, 0.1)',
                                                color: 'var(--color-primary)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: '0.875rem',
                                                fontWeight: 500
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteEvent(event.id)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                color: '#ef4444',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: '0.875rem',
                                                fontWeight: 500
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const EditEventForm: React.FC<{ event: any; onSave: (event: any) => void; onCancel: () => void }> = ({ event, onSave, onCancel }) => {
    const [formData, setFormData] = React.useState({
        sport: event.sport,
        team: event.team,
        opponent: event.opponent,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
        venue: event.venue,
        imageUrl: event.imageUrl
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const inputStyle = {
        width: '100%',
        padding: '0.5rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontSize: '0.875rem',
        marginBottom: '0.5rem'
    };

    return (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input name="sport" value={formData.sport} onChange={handleChange} style={inputStyle} placeholder="Sport" />
                <input name="team" value={formData.team} onChange={handleChange} style={inputStyle} placeholder="Team" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input name="opponent" value={formData.opponent} onChange={handleChange} style={inputStyle} placeholder="Opponent" />
                <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input name="location" value={formData.location} onChange={handleChange} style={inputStyle} placeholder="Location" />
                <input name="venue" value={formData.venue} onChange={handleChange} style={inputStyle} placeholder="Venue" />
            </div>
            <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} style={inputStyle} placeholder="Image URL" />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                    onClick={() => onSave(formData)}
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 500
                    }}
                >
                    Save
                </button>
                <button
                    onClick={onCancel}
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text)',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 500
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AdminPage;
