import { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlay, FiShuffle } from 'react-icons/fi';
import { getPlaylistTracks, getPlaylist } from '../services/ytmusic';
import { usePlayer } from '../contexts';
import type { Song } from '../types/music';
import { PageLayout, SkeletonLoader } from '../components';

interface PlaylistDetailProps {
    playlistId: string | number;
    initialTitle?: string;
    isSidebarOpen: boolean;
    onBack: () => void;
}

export default function PlaylistDetail({
    playlistId,
    initialTitle,
    isSidebarOpen,
    onBack
}: PlaylistDetailProps) {
    const [songs, setSongs] = useState<Song[]>([]);
    const [title, setTitle] = useState(initialTitle || 'Playlist');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [loading, setLoading] = useState(true);
    const { playQueue } = usePlayer();

    useEffect(() => {
        const fetchTracks = async () => {
            setLoading(true);
            try {
                // 병렬로 상세 정보와 트랙 가져오기
                const [playlistData, tracksData] = await Promise.all([
                    getPlaylist(String(playlistId)),
                    getPlaylistTracks(playlistId)
                ]);

                if (playlistData) {
                    setTitle(playlistData.title);
                    setDescription(playlistData.description);
                    setThumbnail(playlistData.thumbnail);
                }

                setSongs(tracksData);
            } catch (error) {
                console.error('Failed to fetch playlist tracks:', error);
            } finally {
                setLoading(false);
            }
        };

        if (playlistId) {
            fetchTracks();
        }
    }, [playlistId]);

    const handlePlayAll = () => {
        if (songs.length > 0) {
            playQueue(songs, 0);
        }
    };

    const handleShuffleRaw = () => {
        if (songs.length > 0) {
            // Fisher-Yates Shuffle
            const shuffled = [...songs];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            playQueue(shuffled, 0);
        }
    };

    return (
        <PageLayout isSidebarOpen={isSidebarOpen}>
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <FiArrowLeft className="w-5 h-5 mr-2" />
                    돌아가기
                </button>

                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <div>
                        {/* Header */}
                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                            {thumbnail && (
                                <img
                                    src={thumbnail}
                                    alt={title}
                                    className="w-48 h-48 rounded-lg shadow-lg object-cover"
                                />
                            )}
                            <div className="flex flex-col justify-end">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                                <p className="text-gray-600 mb-6 max-w-2xl line-clamp-3">{description}</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handlePlayAll}
                                        className="flex items-center px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                                    >
                                        <FiPlay className="w-5 h-5 mr-2 fill-current" />
                                        모두 재생
                                    </button>
                                    <button
                                        onClick={handleShuffleRaw}
                                        className="flex items-center px-6 py-3 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                    >
                                        <FiShuffle className="w-5 h-5 mr-2" />
                                        셔플
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Song List */}
                        <div className="space-y-1">
                            {songs.map((song, index) => (
                                <div
                                    key={song.id}
                                    onClick={() => playQueue(songs, index)}
                                    className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer group transition-colors"
                                >
                                    <span className="w-8 text-center text-gray-400 group-hover:hidden">
                                        {index + 1}
                                    </span>
                                    <FiPlay className="w-8 h-4 text-gray-900 hidden group-hover:block" />

                                    <div className="flex-1 min-w-0 ml-4">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                            {song.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {song.artist}
                                        </p>
                                    </div>
                                    <span className="text-sm text-gray-400 ml-4">
                                        {song.duration}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {songs.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                곡이 없습니다.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
