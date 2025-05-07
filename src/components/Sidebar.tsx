import React, {ReactElement, useCallback, useMemo, useState} from 'react';
import {Calendar as CalendarIcon, Clock, Info, LucideIcon, Menu, PieChart, X} from 'lucide-react';
import {Holiday} from '@/types/Holiday';
import Button from './ui/Button';
import {StatCard} from './calendar/StatCard';
import {HolidayCard} from './calendar/HolidayCard';
import {CountdownCard} from './calendar/CountdownCard';
import {VisualizationCard} from './calendar/VisualizationCard';
import {useCalendar} from '@/hooks/useCalendar';

type TabType = 'stats' | 'nav' | 'holiday' | 'countdown' | 'visual';

interface SidebarProps {
    holidays: Holiday[];
}

interface PieChartDataItem {
    label: string;
    value: number;
    color: string;
    percentage: string;
}

const TabButton: React.FC<{
    type: TabType;
    activeTab: TabType;
    onClick: () => void;
    icon: LucideIcon;
    label: string;
}> = ({type, activeTab, onClick, icon: Icon, label}) => (
    <Button
        onClick={onClick}
        variant={activeTab === type ? 'primary' : 'secondary'}
        size="sm"
        icon={Icon}
    >
        {label}
    </Button>
);

/* eslint-disable  @typescript-eslint/no-explicit-any */
const TabContent: React.FC<{
    activeTab: TabType;
    monthStats: any;
    nextHoliday: Holiday | null;
    getCountdown: () => string;
    displayMonthIndex: number;
    setDisplayMonthIndex: (index: number) => void;
    pieChartData: PieChartDataItem[];
}> = ({
          activeTab,
          monthStats,
          nextHoliday,
          getCountdown,
          displayMonthIndex,
          setDisplayMonthIndex,
          pieChartData
      }) => {
    switch (activeTab) {
        case 'stats':
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">本月统计</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard label="总天数" value={monthStats.totalDays}/>
                        <StatCard label="工作日" value={monthStats.workDays}/>
                        <StatCard label="节假日" value={monthStats.holidayDays}/>
                        <StatCard label="调休日" value={monthStats.txDays}/>
                    </div>
                </div>
            );
        case 'nav':
            return (
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
            );
        case 'holiday':
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">最近节假日</h3>
                    {nextHoliday ? (
                        <HolidayCard holiday={nextHoliday}/>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">暂无节假日信息</p>
                    )}
                </div>
            );
        case 'countdown':
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">倒计时</h3>
                    <CountdownCard getCountdown={getCountdown}/>
                </div>
            );
        case 'visual':
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">数据可视化</h3>
                    <VisualizationCard data={pieChartData}/>
                </div>
            );
        default:
            return null;
    }
};

export function Sidebar({holidays}: SidebarProps): ReactElement {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('stats');

    const {
        displayMonthIndex,
        monthStats,
        nextHoliday,
        getCountdown,
        setDisplayMonthIndex
    } = useCalendar(holidays);

    const toggleSidebar = useCallback((): void => {
        setIsOpen(prev => !prev);
    }, []);

    const pieChartData = useMemo<PieChartDataItem[]>(() => {
        const total = monthStats.totalDays;
        return [
            {label: '工作日', value: monthStats.workDays, color: '#3B82F6'},
            {label: '节假日', value: monthStats.holidayDays, color: '#EF4444'},
            {label: '调休日', value: monthStats.txDays, color: '#F59E0B'},
            {label: '周末', value: monthStats.weekendDays, color: '#10B981'}
        ].map(item => ({
            ...item,
            percentage: ((item.value / total) * 100).toFixed(1)
        }));
    }, [monthStats]);

    return (
        <>
            <Button
                onClick={toggleSidebar}
                variant="secondary"
                size="sm"
                icon={isOpen ? X : Menu}
                className="fixed top-4 left-4 z-50"
                aria-label={isOpen ? "关闭侧边栏" : "打开侧边栏"}
            />

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={toggleSidebar}
                    role="presentation"
                />
            )}

            <div
                className={`fixed top-0 left-0 h-full w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl transform transition-all duration-300 ease-in-out z-50 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6 h-full flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-6">
                        <TabButton
                            type="stats"
                            activeTab={activeTab}
                            onClick={() => setActiveTab('stats')}
                            icon={CalendarIcon}
                            label="统计"
                        />
                        <TabButton
                            type="nav"
                            activeTab={activeTab}
                            onClick={() => setActiveTab('nav')}
                            icon={Clock}
                            label="导航"
                        />
                        <TabButton
                            type="holiday"
                            activeTab={activeTab}
                            onClick={() => setActiveTab('holiday')}
                            icon={Info}
                            label="节假日"
                        />
                        <TabButton
                            type="countdown"
                            activeTab={activeTab}
                            onClick={() => setActiveTab('countdown')}
                            icon={Clock}
                            label="倒计时"
                        />
                        <TabButton
                            type="visual"
                            activeTab={activeTab}
                            onClick={() => setActiveTab('visual')}
                            icon={PieChart}
                            label="可视化"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <TabContent
                            activeTab={activeTab}
                            monthStats={monthStats}
                            nextHoliday={nextHoliday}
                            getCountdown={getCountdown}
                            displayMonthIndex={displayMonthIndex}
                            setDisplayMonthIndex={setDisplayMonthIndex}
                            pieChartData={pieChartData}
                        />
                    </div>
                </div>
            </div>
        </>
    );
} 