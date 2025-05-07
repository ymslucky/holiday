import React, { ReactElement } from 'react';
import Card from '../ui/Card';
import { Holiday } from '@/types/Holiday';

interface HolidayCardProps {
    holiday: Holiday;
    className?: string;
}

export const HolidayCard = React.memo(function HolidayCard({ 
    holiday, 
    className = '' 
}: HolidayCardProps): ReactElement {
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Card className={className}>
            <h4 className="font-medium text-gray-800 dark:text-gray-200">{holiday.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {formatDate(holiday.startDate)} - {formatDate(holiday.endDate)}
            </p>
            {holiday.txDateList.length > 0 && (
                <div className="mt-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">调休安排：</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {holiday.txDateList.map(formatDate).join('、')}
                    </p>
                </div>
            )}
        </Card>
    );
}); 