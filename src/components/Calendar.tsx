import React from 'react';
import {Holiday} from "@/types/Holiday";


// 工具函数集合
const DateUtils = {
    getDaysInMonth: (year: number, month: number): number => new Date(year, month + 1, 0).getDate(),
    getFirstDayOfWeek: (year: number, month: number): number => {
        const dayOfWeek = new Date(year, month, 1).getDay();
        return dayOfWeek === 0 ? 7 : dayOfWeek;
    },
    getDaysBetweenDates: (startDateStr: string, endDateStr: string): string[] => {
        const dates: string[] = [];
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        while (startDate <= endDate) {
            dates.push(DateUtils.formatDate(startDate));
            startDate.setDate(startDate.getDate() + 1);
        }
        return dates;
    },
    formatDate: (date: Date): string => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
};

interface CalendarProps {
    calendar: {
        curYear: number;
        curMonth: number;
        holidays: Holiday[];
    };
}

interface CalendarDayProps {
    date: string;
    isHoliday?: boolean;
    isTx?: boolean;
}

// 样式常量
const cellSizeClasses = "w-8 md:w-12 lg:w-16 h-8 md:h-12 lg:h-16";

export default function Calendar({calendar}: CalendarProps) {
    const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

    const curYear = calendar.curYear;
    const curMonth = calendar.curMonth;
    const firstDayOfWeek = DateUtils.getFirstDayOfWeek(curYear, curMonth);
    const daysCountOfMonth = DateUtils.getDaysInMonth(curYear, curMonth);
    const days = Array.from({length: daysCountOfMonth}, (_, index) => {
        return index + 1;
    });


    const holidayDates = calendar.holidays.flatMap((holiday) => DateUtils.getDaysBetweenDates(holiday.startDate, holiday.endDate));
    const txDates = calendar.holidays.flatMap((holiday) => holiday.txDateList);

    return (
        <div className="bg-white rounded-lg shadow-lg p-16 hover:transform-3d translate-x-5">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                {`${curYear} 年 ${curMonth + 1} 月`}
            </h2>

            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-2 md:gap-4 text-sm font-medium text-gray-500">
                {weekDays.map((title, index) => (
                    <div key={`title-${index}`}
                         className={`flex justify-center items-center rounded-lg text-center font-bold text-xl font-serif ${index % 7 >= 5 ? 'text-red-500' : ''} ${cellSizeClasses}`}>
                        {title}
                    </div>
                ))}
            </div>

            {/* 日期格子 */}
            <div className="grid grid-cols-7 grid-rows-6 gap-2 md:gap-4 mt-4">
                {Array.from({length: firstDayOfWeek - 1}, (_, index) => (
                    <div key={`empty-${index}`}/>
                ))}
                {days.map((day) => {
                    const dateString = DateUtils.formatDate(new Date(curYear, curMonth, day))
                    const isHoliday = holidayDates.includes(dateString);
                    const isTx = txDates.includes(dateString);
                    return <CalendarDay
                        key={`${curYear}-${curMonth}-${day}`}
                        date={`${curYear}-${curMonth + 1}-${day}`}
                        isHoliday={isHoliday}
                        isTx={isTx}
                    />
                })}
            </div>
        </div>
    );
}


function CalendarDay({date, isHoliday = false, isTx = false}: CalendarDayProps) {
    const curDate = new Date(date);
    const dayNumber = curDate.getDate();
    const isToday = curDate.toDateString() === new Date().toDateString();
    const isWeekend = curDate.getDay() === 0 || curDate.getDay() === 6;

    return (
        <div className={`calendar-grid ${cellSizeClasses} ${
            isToday ? 'bg-blue-500 text-white' : 'bg-gray-100'
        } ${
            isTx ? 'calendar-grid-tx' : ''
        } ${
            isHoliday ? 'calendar-grid-holiday' : ''
        } ${
            isWeekend ? 'calendar-grid-week' : ''
        }
        }`}>
            {dayNumber && (
                <div className="font-semibold">
                    {dayNumber}
                </div>
            )}
        </div>
    )
}