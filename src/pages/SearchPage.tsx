import { useState, useEffect } from 'react';
import { FiPlay } from 'react-icons/fi';
import { searchMusic } from '../services/ytmusic';
import { usePlayer } from '../contexts';
import type { Song } from '../types/music';
import { PageLayout, SkeletonLoader } from '../components';

interface SearchPageProps {
    query: string;
    isSidebarOpen: boolean;
}

export default function SearchPage({ query, isSidebarOpen }: SearchPageProps) {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const { playQueue } = usePlayer();

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;

            setLoading(true);
            try {
                const results = await searchMusic(query);
                setSongs(results);
            } catch (error) {
                console.error('Failed to search music:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <PageLayout isSidebarOpen={isSidebarOpen}>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    "{query}" 검색 결과
                </h1>

                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <div>
                        {/* Song List */}
                        <div className="space-y-1">
                            {songs.length > 0 ? (
                                songs.map((song, index) => (
                                    <div
                                        key={song.id}
                                        onClick={() => playQueue(songs, index)}
                                        className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer group transition-colors"
                                    >
                                        <div className="relative w-12 h-12 mr-4 flex-shrink-0">
                                            <img
                                                src={song.thumbnail}
                                                alt={song.title}
                                                className="w-full h-full object-cover rounded"
                                            />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                                                <FiPlay className="w-5 h-5 text-white fill-current" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {song.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">
                                                {song.artist} • {song.album}
                                            </p>
                                        </div>
                                        <span className="text-sm text-gray-400 ml-4">
                                            {song.duration}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    검색 결과가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
