import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    footer?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ children, className = '', title, subtitle, footer, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 ${className}`}
                {...props}
            >
                {(title || subtitle) && (
                    <div className="mb-4">
                        {title && (
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                <div className="flex-1">{children}</div>
                {footer && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {footer}
                    </div>
                )}
            </div>
        );
    }
); 