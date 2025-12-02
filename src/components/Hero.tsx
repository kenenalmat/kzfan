import React from 'react';
import { useTranslation } from 'react-i18next';
import SearchInput from './SearchInput';

interface HeroProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
}

const Hero: React.FC<HeroProps> = ({ searchValue, onSearchChange }) => {
    const { t } = useTranslation();

    return (
        <div style={{
            padding: '6rem 2rem 4rem',
            textAlign: 'center',
            background: 'radial-gradient(circle at 50% 0%, rgba(0, 175, 202, 0.15) 0%, transparent 50%)'
        }}>
            <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 800,
                marginBottom: '1.5rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                {t('hero.title')} <br />
                <span style={{ color: 'var(--color-primary)', WebkitTextFillColor: 'var(--color-primary)' }}>{t('hero.subtitle')}</span>
            </h1>
            <p style={{
                fontSize: '1.25rem',
                color: 'var(--color-text-muted)',
                maxWidth: '600px',
                margin: '0 auto 3rem',
                lineHeight: 1.6
            }}>
                {t('hero.description')}
            </p>

            <SearchInput value={searchValue} onChange={onSearchChange} />
        </div>
    );
};

export default Hero;
