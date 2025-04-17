import { useState, useCallback } from 'react';
import { Language } from '@/types';

const getInitialLanguage = (): Language => {
    if (typeof window === 'undefined') return 'zh';
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'zh';
};

export function useLanguage() {
    const [language, setLanguage] = useState<Language>(getInitialLanguage);

    const changeLanguage = useCallback((newLanguage: Language) => {
        setLanguage(newLanguage);
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', newLanguage);
        }
    }, []);

    return { language, setLanguage: changeLanguage };
} 