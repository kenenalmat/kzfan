import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'kk' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(0, 175, 202, 0.1)',
                color: 'var(--color-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}
        >
            <span>{i18n.language === 'en' ? '🇰🇿' : '🇬🇧'}</span>
            <span>{i18n.language === 'en' ? 'ҚАЗ' : 'ENG'}</span>
        </button>
    );
};

export default LanguageSwitcher;
