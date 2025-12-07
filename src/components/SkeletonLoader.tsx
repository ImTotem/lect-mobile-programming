export default function SkeletonLoader() {
    return (
        <div className="animate-pulse">
            {/* Hero Section Skeleton - 실제 HeroSection과 동일한 구조 */}
            <section className="mb-12">
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-300 to-gray-200 p-8 flex items-end shadow-xl">
                    <div className="relative z-10 space-y-2">
                        <div className="h-10 sm:h-12 bg-gray-400/50 rounded w-64 sm:w-96"></div>
                        <div className="h-6 bg-gray-400/50 rounded w-48 sm:w-72"></div>
                    </div>
                    <div className="absolute inset-0 bg-black/5" />
                </div>
            </section>

            {/* Quick Play Section Skeleton - 실제 QuickPlaySection과 동일한 구조 */}
            <section className="mb-12">
                <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                        >
                            {/* 썸네일 */}
                            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                            {/* 텍스트 */}
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            {/* 재생 버튼 */}
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Playlist Section Skeleton - 실제 PlaylistSection과 동일한 구조 */}
            <section className="mb-12">
                <div className="h-8 bg-gray-200 rounded w-40 mb-6"></div>
                <div className="relative overflow-clip">
                    {/* Fade effect */}
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 via-gray-50/60 to-transparent pointer-events-none z-10" />

                    <div className="overflow-x-auto overflow-y-visible scrollbar-hide pb-4 -mb-4">
                        <div className="flex gap-4 sm:gap-6">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex-shrink-0 w-48 sm:w-56 first:ml-0 last:mr-20">
                                    <div className="group cursor-pointer">
                                        {/* 플레이리스트 이미지 */}
                                        <div className="aspect-square bg-gray-200 rounded-lg mb-3 shadow-md"></div>
                                        {/* 제목 */}
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        {/* 설명 */}
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Chart Section Skeleton - 실제 ChartSection과 동일한 구조 */}
            <section>
                <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4"
                            >
                                {/* 순위 */}
                                <span className="w-6 h-5 bg-gray-200 rounded text-center"></span>
                                {/* 썸네일 */}
                                <div className="w-14 h-14 bg-gray-200 rounded-lg shadow-sm"></div>
                                {/* 곡 정보 */}
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                                {/* 앨범 (hidden on mobile) */}
                                <div className="hidden sm:block h-3 bg-gray-200 rounded w-24"></div>
                                {/* 재생시간 */}
                                <div className="h-3 bg-gray-200 rounded w-12"></div>
                                {/* 재생 버튼 */}
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
