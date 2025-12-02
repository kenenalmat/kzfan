import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            marginTop: 'auto'
        }}>
            <p>&copy; {new Date().getFullYear()} KZ Fan. Supporting our athletes worldwide.</p>
        </footer>
    );
};

export default Footer;
