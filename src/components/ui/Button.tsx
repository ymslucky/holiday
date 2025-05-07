import React from 'react';
import {LucideIcon} from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
}

export default function Button(props: ButtonProps) {
    const {
        children,
        variant = 'primary',
        size = 'md',
        icon: Icon,
        iconPosition = 'left',
        fullWidth = false,
        className = '',
    } = props;
    const baseStyles = "inline-flex items-center justify-center rounded-lg transition-all duration-300 font-medium";

    const variantStyles = {
        primary: "bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md",
        secondary: "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600",
        outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
    };

    const sizeStyles = {
        sm: "px-2 py-1 text-sm",
        md: "px-3 py-2 text-base",
        lg: "px-4 py-3 text-lg"
    };

    const widthStyles = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
            {...props}
        >
            {Icon && iconPosition === 'left' && (
                <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} className="mr-2"/>
            )}
            {children}
            {Icon && iconPosition === 'right' && (
                <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} className="ml-2"/>
            )}
        </button>
    );
}