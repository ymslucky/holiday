import { useState, useCallback, useMemo } from 'react';
import { Holiday } from '@/types/Holiday';
import { DateUtils } from '@/utils/DateUtils';

export function useCalendar(holidays: Holiday[]) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [displayMonthIndex, setDisplayMonthIndex] = useState(currentDate.getMonth());

    // 月份切换逻辑
    const adjustMonth = useCallback((delta: number) => {
        setDisplayMonthIndex(prev => (prev + delta + 12) % 12);
    }, []);

    // 年份切换逻辑
    const changeYear = useCallback((year: number) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(year);
        setCurrentDate(newDate);
    }, [currentDate]);

    // 计算当月统计信息
    const monthStats = useMemo(() => {
        const year = currentDate.getFullYear();
        const daysInMonth = DateUtils.getDaysInMonth(year, displayMonthIndex);
        
        // 计算周末天数
        const weekendDays = Array.from({length: daysInMonth}, (_, i) => {
            const date = new Date(year, displayMonthIndex, i + 1);
            return date.getDay() === 0 || date.getDay() === 6;
        }).filter(Boolean).length;

        // 计算节假日天数
        const holidayDays = holidays
            .filter(holiday => {
                const startDate = new Date(holiday.startDate);
                const endDate = new Date(holiday.endDate);
                return startDate.getMonth() === displayMonthIndex || endDate.getMonth() === displayMonthIndex;
            })
            .reduce((acc, holiday) => {
                const days = DateUtils.getDaysBetweenDates(holiday.startDate, holiday.endDate)
                    .filter(date => new Date(date).getMonth() === displayMonthIndex).length;
                return acc + days;
            }, 0);

        // 计算调休天数
        const txDays = holidays
            .flatMap(holiday => holiday.txDateList)
            .filter(date => new Date(date).getMonth() === displayMonthIndex).length;

        return {
            totalDays: daysInMonth,
            weekendDays,
            holidayDays,
            txDays,
            workDays: daysInMonth - weekendDays - holidayDays + txDays
        };
    }, [currentDate, displayMonthIndex, holidays]);

    // 获取最近的节假日
    const nextHoliday = useMemo(() => {
        const today = new Date();
        return holidays
            .filter(holiday => new Date(holiday.startDate) > today)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
    }, [holidays]);

    // 计算倒计时
    const getCountdown = useCallback(() => {
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(18, 0, 0, 0); // 假设工作日结束时间为18:00

        if (nextHoliday) {
            const holidayStart = new Date(nextHoliday.startDate);
            const timeToHoliday = holidayStart.getTime() - now.getTime();
            const days = Math.floor(timeToHoliday / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeToHoliday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return `距离${nextHoliday.name}还有 ${days}天${hours}小时`;
        } else {
            const timeToEnd = endOfDay.getTime() - now.getTime();
            const hours = Math.floor(timeToEnd / (1000 * 60 * 60));
            const minutes = Math.floor((timeToEnd % (1000 * 60 * 60)) / (1000 * 60));
            return `距离下班还有 ${hours}小时${minutes}分钟`;
        }
    }, [nextHoliday]);

    return {
        currentDate,
        displayMonthIndex,
        monthStats,
        nextHoliday,
        getCountdown,
        adjustMonth,
        changeYear,
        setDisplayMonthIndex
    };
} 