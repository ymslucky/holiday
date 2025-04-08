import React, {useMemo} from 'react';
import {Holiday} from "@/types/Holiday";
import {DateUtils} from "@/utils/DateUtils";

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
const styles = {
    container: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl",
    title: "text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800 tracking-wide",
    weekDay: "flex justify-center items-center text-center font-medium text-sm md:text-base text-gray-600",
    weekendDay: "text-red-500",
    calendarDay: "calendar-grid transition-all duration-200 hover:scale-105",
    today: "bg-blue-500 text-white shadow-lg",
    holiday: "calendar-grid-holiday text-white",
    tx: "calendar-grid-tx text-white",
    weekend: "calendar-grid-week text-red-500",
    normalDay: "bg-gray-50 hover:bg-gray-100",
    dayNumber: "font-medium text-sm md:text-base"
};

export default function Calendar({calendar}: CalendarProps) {
    const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

    const curYear = calendar.curYear;
    const curMonth = calendar.curMonth;
    const firstDayOfWeek = DateUtils.getFirstDayOfWeek(curYear, curMonth);
    const daysCountOfMonth = DateUtils.getDaysInMonth(curYear, curMonth);
    const days = Array.from({length: daysCountOfMonth}, (_, index) => {
        return index + 1;
    });

    const holidayDates = useMemo(() => 
        calendar.holidays.flatMap((holiday) => 
            DateUtils.getDaysBetweenDates(holiday.startDate, holiday.endDate)
        ), 
        [calendar.holidays]
    );

    const txDates = useMemo(() => 
        calendar.holidays.flatMap((holiday) => holiday.txDateList), 
        [calendar.holidays]
    );

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                {`${curYear} 年 ${curMonth + 1} 月`}
            </h2>

            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
                {weekDays.map((title, index) => (
                    <div 
                        key={`title-${index}`}
                        className={`${styles.weekDay} ${index % 7 >= 5 ? styles.weekendDay : ''}`}
                    >
                        {title}
                    </div>
                ))}
            </div>

            {/* 日期格子 */}
            <div className="grid grid-cols-7 gap-2 md:gap-4">
                {Array.from({length: firstDayOfWeek - 1}, (_, index) => (
                    <div key={`empty-${index}`}/>
                ))}
                {days.map((day) => {
                    const dateString = DateUtils.formatDate(new Date(curYear, curMonth, day));
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
        <div 
            className={`${styles.calendarDay} ${
                isToday ? styles.today :
                isHoliday ? styles.holiday :
                isTx ? styles.tx :
                isWeekend ? styles.weekend :
                styles.normalDay
            }`}
        >
            <div className={styles.dayNumber}>
                {dayNumber}
            </div>
        </div>
    )
}