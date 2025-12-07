interface LoadingSpinnerProps {
    message?: string;
}

export default function LoadingSpinner({ message = '로딩 중...' }: LoadingSpinnerProps) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );
}
