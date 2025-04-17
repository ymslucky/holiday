import React, { useState, useCallback, useMemo } from 'react';
import { Menu, X, Calendar as CalendarIcon, Clock, Info } from 'lucide-react';
import { DateUtils } from '@/utils/DateUtils';
import { Holiday } from '@/types/Holiday';

interface SidebarProps {
    currentDate: Date;
    displayMonthIndex: number;
    holidays: Holiday[];
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
}

export function Sidebar({ currentDate, displayMonthIndex, holidays, onMonthChange, onYearChange }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'stats' | 'nav' | 'holiday'>('stats');

    const toggleSidebar = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // 计算当月统计信息
    const monthStats = useMemo(() => {
        const year = currentDate.getFullYear();
        const daysInMonth = DateUtils.getDaysInMonth(year, displayMonthIndex);
        const firstDay = DateUtils.getFirstDayOfWeek(year, displayMonthIndex);
        
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
                const startDate = new Date(holiday.startDate);
                const endDate = new Date(holiday.endDate);
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

    return (
        <>
            {/* 侧边栏切换按钮 */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 transition-colors shadow-sm"
                aria-label={isOpen ? "关闭侧边栏" : "打开侧边栏"}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* 侧边栏背景遮罩 */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            {/* 侧边栏内容 */}
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6">
                    {/* 标签页切换 */}
                    <div className="flex space-x-2 mb-6">
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                                activeTab === 'stats' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <CalendarIcon size={16} className="mr-2" />
                            统计
                        </button>
                        <button
                            onClick={() => setActiveTab('nav')}
                            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                                activeTab === 'nav' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Clock size={16} className="mr-2" />
                            导航
                        </button>
                        <button
                            onClick={() => setActiveTab('holiday')}
                            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                                activeTab === 'holiday' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Info size={16} className="mr-2" />
                            节假日
                        </button>
                    </div>

                    {/* 统计信息 */}
                    {activeTab === 'stats' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">本月统计</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">总天数</p>
                                    <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{monthStats.totalDays}天</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">工作日</p>
                                    <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{monthStats.workDays}天</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">节假日</p>
                                    <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{monthStats.holidayDays}天</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">调休日</p>
                                    <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{monthStats.txDays}天</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 快速导航 */}
                    {activeTab === 'nav' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">快速导航</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from({length: 12}, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onMonthChange(i)}
                                        className={`p-2 text-center rounded-lg transition-colors ${
                                            displayMonthIndex === i
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {i + 1}月
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 节假日信息 */}
                    {activeTab === 'holiday' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">最近节假日</h3>
                            {nextHoliday ? (
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200">{nextHoliday.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(nextHoliday.startDate).toLocaleDateString()} - 
                                        {new Date(nextHoliday.endDate).toLocaleDateString()}
                                    </p>
                                    {nextHoliday.txDateList.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">调休安排：</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {nextHoliday.txDateList.map(date => 
                                                    new Date(date).toLocaleDateString()
                                                ).join('、')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">暂无节假日信息</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 