'use client';

import {useState, useEffect, useMemo, useCallback} from 'react';
import {Calendar} from '@/components/Calendar';
import {Settings} from '@/components/Settings';
import {ErrorBoundary} from '@/components/ErrorBoundary';
import {LoadingSpinner} from '@/components/LoadingSpinner';
import {useTheme} from '@/hooks/useTheme';
import {useLanguage} from '@/hooks/useLanguage';
import holidays from '../../public/data/holiday_2025.json';

// 工具函数集合
export default function HolidayCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [displayMonthIndex, setDisplayMonthIndex] = useState(currentDate.getMonth());
    const [isLoading, setIsLoading] = useState(true);
    const {theme, setTheme} = useTheme();
    const {language, setLanguage} = useLanguage();

    // 初始化加载
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

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

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${backgroundStyle}`}>
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <ErrorBoundary>
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
        </ErrorBoundary>
    );
}