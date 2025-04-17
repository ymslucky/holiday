import React, { useState, useCallback, useMemo } from 'react';
import { Menu, X, Calendar as CalendarIcon, Clock, Info, PieChart } from 'lucide-react';
import { Holiday } from '@/types/Holiday';
import { Button } from './ui/Button';
import { StatCard } from './calendar/StatCard';
import { HolidayCard } from './calendar/HolidayCard';
import { CountdownCard } from './calendar/CountdownCard';
import { VisualizationCard } from './calendar/VisualizationCard';
import { useCalendar } from '@/hooks/useCalendar';

interface SidebarProps {
    holidays: Holiday[];
}

export function Sidebar({ holidays }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'stats' | 'nav' | 'holiday' | 'countdown' | 'visual'>('stats');
    
    const {
        displayMonthIndex,
        monthStats,
        nextHoliday,
        getCountdown,
        setDisplayMonthIndex
    } = useCalendar(holidays);

    const toggleSidebar = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

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
            <Button
                onClick={toggleSidebar}
                variant="secondary"
                size="sm"
                icon={isOpen ? X : Menu}
                className="fixed top-4 left-4 z-50"
                aria-label={isOpen ? "关闭侧边栏" : "打开侧边栏"}
            />

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
                        <Button
                            onClick={() => setActiveTab('stats')}
                            variant={activeTab === 'stats' ? 'primary' : 'secondary'}
                            size="sm"
                            icon={CalendarIcon}
                        >
                            统计
                        </Button>
                        <Button
                            onClick={() => setActiveTab('nav')}
                            variant={activeTab === 'nav' ? 'primary' : 'secondary'}
                            size="sm"
                            icon={Clock}
                        >
                            导航
                        </Button>
                        <Button
                            onClick={() => setActiveTab('holiday')}
                            variant={activeTab === 'holiday' ? 'primary' : 'secondary'}
                            size="sm"
                            icon={Info}
                        >
                            节假日
                        </Button>
                        <Button
                            onClick={() => setActiveTab('countdown')}
                            variant={activeTab === 'countdown' ? 'primary' : 'secondary'}
                            size="sm"
                            icon={Clock}
                        >
                            倒计时
                        </Button>
                        <Button
                            onClick={() => setActiveTab('visual')}
                            variant={activeTab === 'visual' ? 'primary' : 'secondary'}
                            size="sm"
                            icon={PieChart}
                        >
                            可视化
                        </Button>
                    </div>

                    {/* 内容区域 */}
                    <div className="flex-1 overflow-y-auto">
                        {/* 统计信息 */}
                        {activeTab === 'stats' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">本月统计</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <StatCard label="总天数" value={monthStats.totalDays} />
                                    <StatCard label="工作日" value={monthStats.workDays} />
                                    <StatCard label="节假日" value={monthStats.holidayDays} />
                                    <StatCard label="调休日" value={monthStats.txDays} />
                                </div>
                            </div>
                        )}

                        {/* 快速导航 */}
                        {activeTab === 'nav' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">快速导航</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {Array.from({length: 12}, (_, i) => (
                                        <Button
                                            key={i}
                                            onClick={() => setDisplayMonthIndex(i)}
                                            variant={displayMonthIndex === i ? 'primary' : 'secondary'}
                                            size="sm"
                                        >
                                            {i + 1}月
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 节假日信息 */}
                        {activeTab === 'holiday' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">最近节假日</h3>
                                {nextHoliday ? (
                                    <HolidayCard holiday={nextHoliday} />
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">暂无节假日信息</p>
                                )}
                            </div>
                        )}

                        {/* 倒计时 */}
                        {activeTab === 'countdown' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">倒计时</h3>
                                <CountdownCard getCountdown={getCountdown} />
                            </div>
                        )}

                        {/* 数据可视化 */}
                        {activeTab === 'visual' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">数据可视化</h3>
                                <VisualizationCard data={pieChartData} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
} 