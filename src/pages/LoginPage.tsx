import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { token } = await api.login({ username, password });
            localStorage.setItem('token', token);
            navigate('/admin');
        } catch (err) {
            setError('Invalid credentials');
        }
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

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 700, textAlign: 'center' }}>Admin Login</h1>
            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required
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
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
