import React, { useEffect, useState, ReactElement } from 'react';
import Card from '../ui/Card';

interface CountdownCardProps {
    getCountdown: () => string;
    className?: string;
}

const UPDATE_INTERVAL = 60000; // 每分钟更新一次

export const CountdownCard = React.memo(function CountdownCard({ 
    getCountdown, 
    className = '' 
}: CountdownCardProps): ReactElement {
    const [countdown, setCountdown] = useState<string>(getCountdown());

    useEffect(() => {
        const updateCountdown = (): void => {
            setCountdown(getCountdown());
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, UPDATE_INTERVAL);
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