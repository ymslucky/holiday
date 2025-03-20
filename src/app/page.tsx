'use client';

import Calendar from "@/component/Calendar";
import React, {useMemo, useState, useEffect} from "react";

// 工具函数集合
const DateUtils = {
    getDaysInMonth: (year: number, month: number): number => new Date(year, month + 1, 0).getDate(),
    getFirstDayOfWeek: (year: number, month: number): number => new Date(year, month, 1).getDay(),
};

export default function HolidayCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [displayMonthIndex, setDisplayMonthIndex] = useState(currentDate.getMonth());

    // 实时更新时间
    useEffect(() => {
        const interval = setInterval(() => setCurrentDate(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    // 合并日期相关数据
    const {year, month: currentMonth, date: today} = useMemo(() => ({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
        date: currentDate.getDate(),
    }), [currentDate]);

    // 月份切换逻辑
    const adjustMonth = (delta: number) => {
        setDisplayMonthIndex(prev => (prev + delta + 12) % 12);
    };

    // 日历配置
    const calendar = useMemo(() => ({
        title: `${year}年 ${displayMonthIndex + 1}月`,
        startDay: DateUtils.getFirstDayOfWeek(year, displayMonthIndex),
        days: DateUtils.getDaysInMonth(year, displayMonthIndex),
        today: displayMonthIndex === currentMonth ? today : -1,
    }), [year, displayMonthIndex, currentMonth, today]);

    // 滚轮事件处理
    const handleWheel = (e: React.WheelEvent) => {
        const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX);
        if (!isVerticalScroll) return;

        adjustMonth(e.deltaY > 0 ? 1 : -1);
    };

    return (
        <div
            className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 overflow-hidden"
            onWheel={handleWheel}
        >
            <div className="m-4">
                <Calendar calendar={calendar}/>
            </div>
        </div>
    );
}