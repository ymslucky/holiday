import React, { ReactElement } from 'react';
import { Card } from '../ui/Card';

interface StatCardProps {
    label: string;
    value: number | string;
    unit?: string;
    className?: string;
}

export const StatCard = React.memo(function StatCard({ 
    label, 
    value, 
    unit = '天',
    className = '' 
}: StatCardProps): ReactElement {
    return (
        <Card className={className}>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-1">
                {value}{unit}
            </p>
        </Card>
    );
}); 