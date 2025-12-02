import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
    const { t } = useTranslation();

    return (
        <header style={{
            padding: '1.5rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: 'rgba(15, 23, 42, 0.8)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                }}>KZ</div>
                <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Fan</span>
            </div>
            <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <LanguageSwitcher />
                <a href="/admin" style={{ color: 'var(--color-text)', fontWeight: 500 }}>{t('header.admin')}</a>
            </nav>
        </header>
    );
};

export default Header;
