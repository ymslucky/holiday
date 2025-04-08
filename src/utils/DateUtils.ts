export const DateUtils = {
    getDaysInMonth: (year: number, month: number): number => new Date(year, month + 1, 0).getDate(),
    getFirstDayOfWeek: (year: number, month: number): number => {
        const dayOfWeek = new Date(year, month, 1).getDay();
        return dayOfWeek === 0 ? 7 : dayOfWeek;
    },
    getDaysBetweenDates: (startDateStr: string, endDateStr: string): string[] => {
        const dates: string[] = [];
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(DateUtils.formatDate(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    },
    formatDate: (date: Date): string => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
};
