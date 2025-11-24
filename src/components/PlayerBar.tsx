import { useState } from 'react';
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiShuffle,
  FiRepeat,
  FiVolume2,
  FiHeart,
} from 'react-icons/fi';

interface PlayerBarProps {
  currentSong?: {
    title: string;
    artist: string;
    thumbnail: string;
  };
}

export default function PlayerBar({ currentSong }: PlayerBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(125); // 2:05
  const [duration] = useState(210); // 3:30

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white">
      {/* Progress Bar - border 위치에 배치 */}
      <div className="relative w-full h-1 bg-gray-200">
        <div
          className="absolute top-0 left-0 h-full bg-red-500 transition-all"
          style={{ width: `${progress}%` }}
        />
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => setCurrentTime(Number(e.target.value))}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-md pointer-events-none transition-all"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 h-20">
        <div className="flex items-center justify-between gap-4 h-full">
          {/* Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xs">
            {currentSong ? (
              <>
                <img
                  src={currentSong.thumbnail}
                  alt={currentSong.title}
                  className="w-12 h-12 rounded-md object-cover shadow-sm flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                    {currentSong.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-1">
                    {currentSong.artist}
                  </p>
                </div>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="hidden sm:block flex-shrink-0"
                >
                  <FiHeart
                    className={`w-5 h-5 transition-colors ${
                      isLiked
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600 hover:text-red-500'
                    }`}
                  />
                </button>
              </>
            ) : (
              <div className="text-gray-400 text-sm">재생 중인 음악이 없습니다</div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Shuffle */}
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className="hidden md:block"
            >
              <FiShuffle
                className={`w-4 h-4 transition-colors ${
                  isShuffle ? 'text-red-500' : 'text-gray-600 hover:text-gray-900'
                }`}
              />
            </button>

            {/* Previous */}
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <FiSkipBack className="w-5 h-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-md"
            >
              {isPlaying ? (
                <FiPause className="text-white w-4 h-4" />
              ) : (
                <FiPlay className="text-white w-4 h-4 ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <FiSkipForward className="w-5 h-5" />
            </button>

            {/* Repeat */}
            <button
              onClick={() =>
                setRepeatMode((prev) =>
                  prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'
                )
              }
              className="hidden md:block relative"
            >
              <FiRepeat
                className={`w-4 h-4 transition-colors ${
                  repeatMode !== 'off'
                    ? 'text-red-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              />
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">
                  1
                </span>
              )}
            </button>

            {/* Time */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 ml-2">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden lg:flex items-center gap-2 flex-1 max-w-xs justify-end">
            <FiVolume2 className="text-gray-600 w-5 h-5 flex-shrink-0" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-600 hover:[&::-webkit-slider-thumb]:bg-gray-700"
              style={{
                background: `linear-gradient(to right, #4b5563 0%, #4b5563 ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
