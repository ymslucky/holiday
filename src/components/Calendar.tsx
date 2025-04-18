import React, { useMemo, memo, ReactElement } from 'react';
import { Holiday } from "@/types/Holiday";
import { DateUtils } from "@/utils/DateUtils";
import { translations } from '@/config/translations';
import { Language } from '@/types';

interface CalendarProps {
    calendar: {
        curYear: number;
        curMonth: number;
        holidays: Holiday[];
    };
    language: Language;
}

interface CalendarDayProps {
    date: string;
    isHoliday?: boolean;
    isTx?: boolean;
    language: Language;
}

interface CalendarStyles {
    [key: string]: string;
}

const styles: CalendarStyles = {
    container: "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl",
    title: "text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200 tracking-wide",
    weekDay: "flex justify-center items-center text-center font-medium text-sm md:text-base text-gray-600 dark:text-gray-400",
    weekendDay: "text-red-500 dark:text-red-400",
    calendarDay: "calendar-grid transition-all duration-200 hover:scale-105",
    today: "bg-blue-500 text-white shadow-lg animate-spin-slow",
    holiday: "calendar-grid-holiday text-white",
    tx: "calendar-grid-tx text-white",
    weekend: "calendar-grid-week text-red-500 dark:text-red-400",
    normalDay: "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600",
    dayNumber: "font-medium text-sm md:text-base text-gray-700 dark:text-gray-300"
};

const CalendarDay = memo(function CalendarDay({ date, isHoliday = false, isTx = false }: CalendarDayProps): ReactElement {
    const today = new Date();
    const currentDate = new Date(date);
    const isToday = today.toDateString() === currentDate.toDateString();
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

    const dayClassName = useMemo(() => {
        const classes = [styles.calendarDay];
        if (isToday) classes.push(styles.today);
        else if (isHoliday) classes.push(styles.holiday);
        else if (isTx) classes.push(styles.tx);
        else if (isWeekend) classes.push(styles.weekend);
        else classes.push(styles.normalDay);
        return classes.join(' ');
    }, [isToday, isHoliday, isTx, isWeekend]);

    return (
        <div className={dayClassName}>
            <span className={styles.dayNumber}>{currentDate.getDate()}</span>
        </div>
    );
});

CalendarDay.displayName = 'CalendarDay';

const WeekDays: React.FC<{ language: Language }> = memo(({ language }) => {
    const weekDays = useMemo(() => 
        language === 'zh' ? ['一', '二', '三', '四', '五', '六', '日'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        [language]
    );

    return (
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
    );
});

WeekDays.displayName = 'WeekDays';

export const Calendar = memo(function Calendar({ calendar, language }: CalendarProps): ReactElement {
    const t = translations[language];
    const { curYear, curMonth } = calendar;
    
    const firstDayOfWeek = DateUtils.getFirstDayOfWeek(curYear, curMonth);
    const daysCountOfMonth = DateUtils.getDaysInMonth(curYear, curMonth);
    
    const days = useMemo(() => 
        Array.from({ length: daysCountOfMonth }, (_, index) => index + 1),
        [daysCountOfMonth]
    );

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

    const title = useMemo(() => 
        `${curYear} ${t.year} ${curMonth + 1} ${t.month}`,
        [curYear, curMonth, t.year, t.month]
    );

    const emptyDays = useMemo(() => 
        Array.from({ length: firstDayOfWeek - 1 }, (_, index) => (
            <div key={`empty-${index}`} />
        )),
        [firstDayOfWeek]
    );

    const dayCells = useMemo(() => 
        days.map((day) => {
            const dateString = DateUtils.formatDate(new Date(curYear, curMonth, day));
            const isHoliday = holidayDates.includes(dateString);
            const isTx = txDates.includes(dateString);
            return (
                <CalendarDay
                    key={`${curYear}-${curMonth}-${day}`}
                    date={`${curYear}-${curMonth + 1}-${day}`}
                    isHoliday={isHoliday}
                    isTx={isTx}
                    language={language}
                />
            );
        }),
        [days, curYear, curMonth, holidayDates, txDates, language]
    );

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <WeekDays language={language} />
            <div className="grid grid-cols-7 gap-2 md:gap-4">
                {emptyDays}
                {dayCells}
            </div>
        </div>
    );
});

Calendar.displayName = 'Calendar'; 