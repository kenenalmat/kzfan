import React from 'react';
import { useTranslation } from 'react-i18next';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    fontSize: '1.125rem',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--color-text)',
                    outline: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(0, 175, 202, 0.1)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
            />
            <div style={{
                position: 'absolute',
                right: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>
        </div>
    );
};

export default SearchInput;
