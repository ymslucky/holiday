import React, { ReactElement } from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

interface SizeClasses {
    [key: string]: string;
}

const sizeClasses: SizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
};

export function LoadingSpinner({ size = 'medium', className = '' }: LoadingSpinnerProps): ReactElement {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin`}
                style={{
                    borderTopColor: 'var(--primary-color, #3B82F6)',
                    borderRightColor: 'var(--primary-color, #3B82F6)'
                }}
            />
        </div>
    );
} 