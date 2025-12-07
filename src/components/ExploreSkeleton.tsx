export default function ExploreSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-10 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>

            {/* Section 1 Skeleton (e.g. Genres) */}
            <section className="mb-12">
                <div className="h-8 bg-gray-200 rounded w-40 mb-6"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={`section1-${i}`} className="aspect-[1.5] bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </section>

            {/* Section 2 Skeleton (e.g. Moods) */}
            <section className="mb-12">
                <div className="h-8 bg-gray-200 rounded w-40 mb-6"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={`section2-${i}`} className="aspect-[1.5] bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </section>
        </div>
    );
}
