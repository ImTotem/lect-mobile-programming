import { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { getMoodPlaylists } from '../services/ytmusic';
import type { Playlist } from '../types/music';
import { PageLayout, SkeletonLoader } from '../components';

interface GenreDetailProps {
    genreParams: string;
    title: string;
    initialColor?: string;
    isSidebarOpen: boolean;
    onBack: () => void;
    onPlaylistClick: (playlist: Playlist) => void;
}

export default function GenreDetail({
    genreParams,
    title,
    initialColor,
    isSidebarOpen,
    onBack,
    onPlaylistClick
}: GenreDetailProps) {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            setLoading(true);
            try {
                const data = await getMoodPlaylists(genreParams);
                setPlaylists(data);
            } catch (error) {
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        if (genreParams) {
            fetchPlaylists();
        }
    }, [genreParams]);

    return (
        <PageLayout isSidebarOpen={isSidebarOpen}>
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <FiArrowLeft className="w-5 h-5 mr-2" />
                    돌아가기
                </button>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
                    <div
                        className="w-full h-48 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-100" // Fallback gradient
                        style={initialColor ? { background: initialColor } : undefined}
                    >
                        <div className="w-full h-full flex items-end p-8 text-white bg-black/20 rounded-2xl">
                            <span className="text-xl font-medium">추천 플레이리스트</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {playlists.map((playlist) => (
                            <div
                                key={playlist.id}
                                onClick={() => onPlaylistClick(playlist)}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                                    <img
                                        src={playlist.thumbnail}
                                        alt={playlist.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-red-500 transition-colors">
                                    {playlist.title}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                    {playlist.description || playlist.tracksCount ? `트랙 ${playlist.tracksCount}개` : 'YouTube Music'}
                                </p>
                            </div>
                        ))}

                        {playlists.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                플레이리스트를 찾을 수 없습니다.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
