'use client';

import {useState, useEffect, useMemo, useCallback} from 'react';
import {Calendar} from '@/components/Calendar';
import {Settings} from '@/components/Settings';
import {themes} from '@/config/themes';
import {Language, Theme} from '@/types';
import holidays from '../../public/data/holiday_2025.json';

// 工具函数集合
export default function HolidayCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [displayMonthIndex, setDisplayMonthIndex] = useState(currentDate.getMonth());
    const [language, setLanguage] = useState<Language>('zh');
    const [theme, setTheme] = useState<Theme>('light');

    // 实时更新时间 - 改为每5分钟更新一次
    useEffect(() => {
        const interval = setInterval(() => setCurrentDate(new Date()), 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // 使用 useCallback 优化月份切换逻辑
    const adjustMonth = useCallback((delta: number) => {
        setDisplayMonthIndex(prev => (prev + delta + 12) % 12);
    }, []);

    // 使用 useCallback 优化滚轮事件处理
    const handleWheel = useCallback((e: React.WheelEvent) => {
        const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX);
        if (!isVerticalScroll) return;
        adjustMonth(e.deltaY > 0 ? 1 : -1);
    }, [adjustMonth]);

    // 使用 useMemo 优化主题应用
    const currentTheme = useMemo(() => themes[theme], [theme]);

    // 应用主题
    useEffect(() => {
        const root = document.documentElement;
        
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
    }, [theme, currentTheme]);

    // 使用 useMemo 优化日历数据
    const calendarData = useMemo(() => ({
        curYear: currentDate.getFullYear(),
        curMonth: displayMonthIndex,
        holidays: holidays
    }), [currentDate, displayMonthIndex]);

    // 使用 useMemo 优化背景样式
    const backgroundStyle = useMemo(() => 
        theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
            : 'bg-gradient-to-br from-blue-50 to-purple-50',
        [theme]
    );

    return (
        <div
            className={`flex items-center justify-center min-h-screen p-4 overflow-hidden transition-colors duration-300 ${backgroundStyle}`}
            onWheel={handleWheel}
        >
            <Settings
                language={language}
                theme={theme}
                onLanguageChange={setLanguage}
                onThemeChange={setTheme}
            />
            <div className="m-4">
                <Calendar
                    calendar={calendarData}
                    language={language}
                />
            </div>
        </div>
    );
}