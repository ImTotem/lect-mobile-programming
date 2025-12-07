interface PageLayoutProps {
    children: React.ReactNode;
    isSidebarOpen: boolean;
}

export default function PageLayout({ children, isSidebarOpen }: PageLayoutProps) {
    return (
        <div
            className={`min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900 pt-16 pb-28 transition-all duration-300 ${isSidebarOpen ? 'pl-0 lg:pl-64' : 'pl-0 lg:pl-20'
                }`}
        >
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </div>
    );
}
