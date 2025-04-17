import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('错误详情:', error);
        console.error('错误堆栈:', errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                            出错了！
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            抱歉，应用程序遇到了一些问题。请刷新页面重试。
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                        >
                            刷新页面
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
} 