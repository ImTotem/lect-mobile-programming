import { FiHeart, FiPlay } from 'react-icons/fi';
import { useStorage } from '../contexts/StorageContext';
import { usePlayer } from '../contexts/PlayerContext';

interface LibraryPageProps {
    isSidebarOpen: boolean;
}

export default function LibraryPage({ isSidebarOpen }: LibraryPageProps) {
    const { likedSongs, toggleLike } = useStorage();
    const { playSong, playQueue, currentSong, isPlaying } = usePlayer();

    const handlePlayAll = () => {
        if (likedSongs.length > 0) {
            playQueue(likedSongs);
        }
    };

    return (
        <div className={`min-h-screen bg-white pt-16 pb-28 transition-all duration-300 ${isSidebarOpen ? 'pl-0 lg:pl-64' : 'pl-0 lg:pl-20'
            }`}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-red-100 rounded-full text-red-600">
                        <FiHeart className="w-8 h-8 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">좋아요 표시한 곡</h1>
                        <p className="text-gray-500 mt-1">{likedSongs.length}곡</p>
                    </div>
                    {likedSongs.length > 0 && (
                        <button
                            onClick={handlePlayAll}
                            className="ml-auto flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-red-600/20 active:scale-95"
                        >
                            <FiPlay className="fill-current w-5 h-5" />
                            <span>모두 재생</span>
                        </button>
                    )}
                </div>

                {likedSongs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <FiHeart className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">아직 좋아요 한 곡이 없습니다</h2>
                        <p className="text-gray-500">마음에 드는 곡에 하트를 눌러보세요.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-1">
                        {likedSongs.map((song, index) => {
                            const isCurrent = currentSong?.id === song.id;

                            return (
                                <div
                                    key={song.id}
                                    className={`group flex items-center gap-4 p-3 rounded-xl transition-colors ${isCurrent ? 'bg-red-50' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="text-sm font-medium text-gray-400 w-6 text-center">
                                        {index + 1}
                                    </div>

                                    <div
                                        onClick={() => playSong(song)}
                                        className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                                    >
                                        <img
                                            src={song.thumbnail}
                                            alt={song.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.currentTarget;
                                                if (!target.src.includes('mqdefault') && !target.src.includes('default')) {
                                                    target.src = `https://i.ytimg.com/vi/${song.id}/mqdefault.jpg`;
                                                } else if (target.src.includes('mqdefault')) {
                                                    target.src = `https://i.ytimg.com/vi/${song.id}/default.jpg`;
                                                }
                                            }}
                                        />
                                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}>
                                            {isCurrent && isPlaying ? (
                                                <div className="w-3 h-3 flex gap-0.5">
                                                    <div className="w-1 bg-white animate-bounce-custom" style={{ animationDelay: '0s' }} />
                                                    <div className="w-1 bg-white animate-bounce-custom" style={{ animationDelay: '0.1s' }} />
                                                    <div className="w-1 bg-white animate-bounce-custom" style={{ animationDelay: '0.2s' }} />
                                                </div>
                                            ) : (
                                                <FiPlay className="w-5 h-5 text-white fill-current" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-medium truncate cursor-pointer hover:underline ${isCurrent ? 'text-red-600' : 'text-gray-900'
                                            }`} onClick={() => playSong(song)}>
                                            {song.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLike(song);
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <FiHeart className="w-5 h-5 fill-current" />
                                    </button>

                                    <div className="text-sm text-gray-500 w-12 text-right">
                                        {song.duration}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
