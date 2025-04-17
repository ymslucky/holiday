import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Menu, X, Calendar as CalendarIcon, Clock, Info, PieChart } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState<'stats' | 'nav' | 'holiday' | 'countdown' | 'visual'>('stats');
    const [countdown, setCountdown] = useState<string>('');

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

    // 计算倒计时
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const endOfDay = new Date(now);
            endOfDay.setHours(18, 0, 0, 0); // 假设工作日结束时间为18:00

            if (nextHoliday) {
                const holidayStart = new Date(nextHoliday.startDate);
                const timeToHoliday = holidayStart.getTime() - now.getTime();
                const days = Math.floor(timeToHoliday / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeToHoliday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                setCountdown(`距离${nextHoliday.name}还有 ${days}天${hours}小时`);
            } else {
                const timeToEnd = endOfDay.getTime() - now.getTime();
                const hours = Math.floor(timeToEnd / (1000 * 60 * 60));
                const minutes = Math.floor((timeToEnd % (1000 * 60 * 60)) / (1000 * 60));
                setCountdown(`距离下班还有 ${hours}小时${minutes}分钟`);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // 每分钟更新一次
        return () => clearInterval(interval);
    }, [nextHoliday]);

    // 计算饼图数据
    const pieChartData = useMemo(() => {
        const total = monthStats.totalDays;
        return [
            { label: '工作日', value: monthStats.workDays, color: '#3B82F6' },
            { label: '节假日', value: monthStats.holidayDays, color: '#EF4444' },
            { label: '调休日', value: monthStats.txDays, color: '#F59E0B' },
            { label: '周末', value: monthStats.weekendDays, color: '#10B981' }
        ].map(item => ({
            ...item,
            percentage: ((item.value / total) * 100).toFixed(1)
        }));
    }, [monthStats]);

    return (
        <>
            {/* 侧边栏切换按钮 */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 transition-all duration-300 shadow-sm hover:shadow-md"
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
                className={`fixed top-0 left-0 h-full w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl transform transition-all duration-300 ease-in-out z-50 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6 h-full flex flex-col">
                    {/* 标签页切换 */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                                activeTab === 'stats' 
                                    ? 'bg-blue-500 text-white shadow-md' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <CalendarIcon size={16} className="mr-2" />
                            统计
                        </button>
                        <button
                            onClick={() => setActiveTab('nav')}
                            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                                activeTab === 'nav' 
                                    ? 'bg-blue-500 text-white shadow-md' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Clock size={16} className="mr-2" />
                            导航
                        </button>
                        <button
                            onClick={() => setActiveTab('holiday')}
                            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                                activeTab === 'holiday' 
                                    ? 'bg-blue-500 text-white shadow-md' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Info size={16} className="mr-2" />
                            节假日
                        </button>
                        <button
                            onClick={() => setActiveTab('countdown')}
                            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                                activeTab === 'countdown' 
                                    ? 'bg-blue-500 text-white shadow-md' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Clock size={16} className="mr-2" />
                            倒计时
                        </button>
                        <button
                            onClick={() => setActiveTab('visual')}
                            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                                activeTab === 'visual' 
                                    ? 'bg-blue-500 text-white shadow-md' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <PieChart size={16} className="mr-2" />
                            可视化
                        </button>
                    </div>

                    {/* 内容区域 */}
                    <div className="flex-1 overflow-y-auto">
                        {/* 统计信息 */}
                        {activeTab === 'stats' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">本月统计</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">总天数</p>
                                        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{monthStats.totalDays}天</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">工作日</p>
                                        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{monthStats.workDays}天</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">节假日</p>
                                        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{monthStats.holidayDays}天</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">调休日</p>
                                        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{monthStats.txDays}天</p>
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
                                            className={`p-3 text-center rounded-xl transition-all duration-300 ${
                                                displayMonthIndex === i
                                                    ? 'bg-blue-500 text-white shadow-md'
                                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm hover:shadow-md'
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
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                        <h4 className="font-medium text-gray-800 dark:text-gray-200">{nextHoliday.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            {new Date(nextHoliday.startDate).toLocaleDateString()} - 
                                            {new Date(nextHoliday.endDate).toLocaleDateString()}
                                        </p>
                                        {nextHoliday.txDateList.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">调休安排：</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
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

                        {/* 倒计时 */}
                        {activeTab === 'countdown' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">倒计时</h3>
                                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                    <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center">
                                        {countdown}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 数据可视化 */}
                        {activeTab === 'visual' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">数据可视化</h3>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">本月时间分布</h4>
                                    <div className="space-y-3">
                                        {pieChartData.map((item, index) => (
                                            <div key={index} className="flex items-center">
                                                <div 
                                                    className="w-4 h-4 rounded-full mr-3"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-300 flex-1">
                                                    {item.label}
                                                </span>
                                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    {item.percentage}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
} 