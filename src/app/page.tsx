'use client';

import Calendar from "@/components/Calendar";
import React, {useEffect, useState} from "react";
import holidays from '../../public/data/holiday_2025.json';

// 工具函数集合
export default function HolidayCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [displayMonthIndex, setDisplayMonthIndex] = useState(currentDate.getMonth());

    // 实时更新时间
    useEffect(() => {
        const interval = setInterval(() => setCurrentDate(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    // 月份切换逻辑
    const adjustMonth = (delta: number) => {
        setDisplayMonthIndex(prev => (prev + delta + 12) % 12);
    };

    // 滚轮事件: 切换月份
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
                <Calendar calendar={{
                    curYear: currentDate.getFullYear(),
                    curMonth: displayMonthIndex,
                    holidays: holidays
                }}/>
            </div>
        </div>
    );
}