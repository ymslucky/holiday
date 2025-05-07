import React, { ReactElement } from 'react';
import Card from '../ui/Card';

interface DataItem {
    label: string;
    value: number;
    percentage: string;
    color: string;
}

interface VisualizationCardProps {
    data: DataItem[];
    className?: string;
}

export const VisualizationCard = React.memo(function VisualizationCard({ 
    data, 
    className = '' 
}: VisualizationCardProps): ReactElement {
    return (
        <Card 
            title="本月时间分布"
            className={className}
        >
            <div className="space-y-3">
                {data.map((item, index) => (
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
        </Card>
    );
}); 