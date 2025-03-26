'use client';

import React from 'react';

interface CalendarProps {
    calendar: {
        title: string;
        startDay: number;
        days: number;
        today: number;
    };
}

export default function Calendar({calendar}: CalendarProps) {
    const {title, startDay, days, today} = calendar;
    const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

    // 生成日历格子数组（包含前导空格和日期）
    const leadingBlanks = (startDay - 1 + 7) % 7;
    const totalCells = leadingBlanks + days;
    const calendarCells = Array.from({length: totalCells}, (_, index) => {
        if (index < leadingBlanks) return null; // 前导空格
        const dayNumber = index - leadingBlanks + 1;
        return dayNumber <= days ? dayNumber : null; // 有效日期
    });

    // 样式常量
    const cellSizeClasses = "w-8 md:w-12 lg:w-16 h-8 md:h-12 lg:h-16";
    const baseCellClasses = "flex justify-center items-center rounded-lg shadow-lg hover:shadow-blue-300";

    return (
        <div className="bg-white rounded-lg shadow-lg p-16 hover:transform-3d translate-x-5">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                {title}
            </h2>

            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-2 md:gap-4 text-sm font-medium text-gray-500">
                {weekDays.map((day, index) => (
                    <div
                        key={day}
                        className={`text-center ${[5, 6].includes(index) ? 'text-red-500' : ''}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* 日期格子 */}
            <div className="grid grid-cols-7 gap-2 md:gap-4 mt-4">
                {calendarCells.map((dayNumber, index) => {
                    if (dayNumber === null) return <div key={index}/>;
                    const isToday = dayNumber === today;
                    return (
                        <div
                            key={index}
                            className={`${cellSizeClasses} ${baseCellClasses} ${
                                isToday ? 'bg-blue-500 text-white' : 'bg-gray-100'
                            }`}
                        >
                            {dayNumber && (
                                <div className="font-semibold">
                                    {dayNumber}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}