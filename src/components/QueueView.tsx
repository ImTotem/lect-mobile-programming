import { useState, useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import LyricsView from './LyricsView';

interface QueueViewProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'queue' | 'lyrics';

export default function QueueView({ isOpen, onClose }: QueueViewProps) {
    const { currentSong, queue, currentIndex, playQueue } = usePlayer();
    const [activeTab, setActiveTab] = useState<TabType>('queue');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleQueueItemClick = (index: number) => {
        // Don't play if same song
        if (index === currentIndex) {
            return;
        }
        playQueue(queue, index);
    };

    return (
        <>
            {/* Backdrop - z-30 to be below sidebar (z-40) */}
            <div
                className={`fixed top-16 bottom-0 left-0 right-0 bg-black/30 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Queue View - z-30 to be below sidebar, slides up from bottom */}
            <div
                className={`fixed top-16 bottom-0 left-0 right-0 z-30 bg-gradient-to-b from-gray-50 to-white transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
            >
                {/* Main Content - with bottom padding for player bar */}
                <div className="h-full flex flex-col lg:flex-row overflow-hidden pb-20">
                    {/* Left Side - Album Art (Mobile: Compact Top, Desktop: Left 2/3) */}
                    <div className="flex-shrink-0 lg:flex-[2] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 max-h-48 lg:max-h-full p-4 lg:p-12 lg:overflow-y-auto transition-all duration-300">
                        {currentSong && (
                            <div className="w-full max-w-lg flex lg:flex-col items-center gap-4 lg:gap-0 lg:h-auto transition-all duration-300">
                                <div className="w-32 h-32 lg:w-full lg:h-auto lg:aspect-square rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 flex-shrink-0 lg:mb-6 transition-all duration-300">
                                    <img
                                        src={currentSong.thumbnail.replace('w120-h120', 'w600-h600')}
                                        alt={currentSong.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-left lg:text-center flex-1 lg:flex-initial min-w-0 transition-all duration-300">
                                    <h1 className="text-lg lg:text-3xl font-bold mb-1 lg:mb-2 text-gray-900 truncate lg:whitespace-normal transition-all duration-300">
                                        {currentSong.title}
                                    </h1>
                                    <p className="text-sm lg:text-lg text-gray-600 truncate lg:whitespace-normal transition-all duration-300">{currentSong.artist}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Tabs (Queue / Lyrics) */}
                    <div className="flex-1 lg:flex-[1] lg:border-l lg:border-gray-200 bg-white flex flex-col">
                        {/* Tab Headers */}
                        <div className="flex border-b border-gray-200 bg-white shadow-sm relative">
                            {/* Sliding underline bar */}
                            <div
                                className={`absolute bottom-0 left-0 h-0.5 w-1/2 bg-red-500 transition-transform duration-300 ease-out ${activeTab === 'lyrics' ? 'translate-x-full' : 'translate-x-0'
                                    }`}
                            />
                            <button
                                onClick={() => setActiveTab('queue')}
                                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-300 relative z-10 ${activeTab === 'queue'
                                    ? 'text-red-600'
                                    : 'text-gray-500'
                                    }`}
                            >
                                다음 트랙
                            </button>
                            <button
                                onClick={() => setActiveTab('lyrics')}
                                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-300 relative z-10 ${activeTab === 'lyrics'
                                    ? 'text-red-600'
                                    : 'text-gray-500'
                                    }`}
                            >
                                가사
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-hidden relative">
                            {/* Queue Tab */}
                            <div
                                className={`absolute inset-0 transition-all duration-300 ${activeTab === 'queue'
                                    ? 'opacity-100 translate-x-0'
                                    : 'opacity-0 -translate-x-full pointer-events-none'
                                    }`}
                            >
                                <div className="h-full overflow-y-auto">
                                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 z-10">
                                        <h2 className="text-base font-semibold text-gray-900">
                                            다음 재생 ({queue.length}곡)
                                        </h2>
                                    </div>
                                    <div className="px-3 py-2">
                                        {queue.map((song, index) => (
                                            <div
                                                key={`${song.id}-${index}`}
                                                onClick={() => handleQueueItemClick(index)}
                                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1 ${index === currentIndex
                                                    ? 'bg-red-50 border border-red-100 shadow-sm'
                                                    : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <img
                                                    src={song.thumbnail}
                                                    alt={song.title}
                                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-sm"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className={`font-medium truncate text-sm ${index === currentIndex ? 'text-red-600' : 'text-gray-900'
                                                            }`}
                                                    >
                                                        {song.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                                                </div>
                                                {index === currentIndex && (
                                                    <div className="flex items-center gap-0.5 flex-shrink-0">
                                                        <div className="w-0.5 h-3 bg-red-500 animate-pulse rounded-full"></div>
                                                        <div className="w-0.5 h-4 bg-red-500 animate-pulse delay-75 rounded-full"></div>
                                                        <div className="w-0.5 h-3 bg-red-500 animate-pulse delay-150 rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Lyrics Tab */}
                            <div
                                className={`absolute inset-0 transition-all duration-300 ${activeTab === 'lyrics'
                                    ? 'opacity-100 translate-x-0'
                                    : 'opacity-0 translate-x-full pointer-events-none'
                                    }`}
                            >
                                <LyricsView lyricsBrowseId={currentSong?.lyricsBrowseId} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
