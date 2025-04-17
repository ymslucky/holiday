import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';

interface CountdownCardProps {
    getCountdown: () => string;
    className?: string;
}

export const CountdownCard = React.memo(function CountdownCard({ 
    getCountdown, 
    className = '' 
}: CountdownCardProps) {
    const [countdown, setCountdown] = useState(getCountdown());

    useEffect(() => {
        const updateCountdown = () => {
            setCountdown(getCountdown());
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // 每分钟更新一次
        return () => clearInterval(interval);
    }, [getCountdown]);

    return (
        <Card className={className}>
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center">
                {countdown}
            </p>
        </Card>
    );
}); 