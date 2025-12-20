import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * 错误边界组件 (ErrorBoundary)
 * 捕获子组件树中的 JavaScript 错误，防止整个应用崩溃
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // 错误日志上报
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">出错了</h2>
                    <p className="text-sm text-gray-500 mb-4 max-w-md">
                        页面遇到了一些问题，请尝试刷新页面或联系管理员。
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={16} />
                        重试
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <pre className="mt-4 p-3 bg-red-50 text-red-600 text-xs text-left rounded overflow-auto max-w-full">
                            {this.state.error.message}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
