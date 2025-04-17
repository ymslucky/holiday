import { useState, useEffect, useCallback } from 'react';
import { Theme } from '@/types';
import { themes } from '@/config/themes';

const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'light';
};

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    // 应用主题
    useEffect(() => {
        const root = document.documentElement;
        const currentTheme = themes[theme];
        
        // 应用所有主题变量
        Object.entries(currentTheme).forEach(([key, value]) => {
            if (key !== 'name') {
                root.style.setProperty(`--${key}`, value);
            }
        });

        // 设置暗色模式类
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // 保存主题到 localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }, []);

    return { theme, setTheme, toggleTheme };
} 