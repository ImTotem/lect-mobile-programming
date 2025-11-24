import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiShuffle,
  FiRepeat,
} from 'react-icons/fi';

interface PlayerControlsProps {
  isPlaying: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
}

export default function PlayerControls({
  isPlaying,
  isShuffle,
  repeatMode,
  currentTime,
  duration,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffleToggle,
  onRepeatToggle,
}: PlayerControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Shuffle */}
      <button onClick={onShuffleToggle} className="hidden md:block">
        <FiShuffle
          className={`w-4 h-4 transition-colors ${
            isShuffle ? 'text-red-500' : 'text-gray-600 hover:text-gray-900'
          }`}
        />
      </button>

      {/* Previous */}
      <button
        onClick={onPrevious}
        className="text-gray-600 hover:text-gray-900 transition-colors"
      >
        <FiSkipBack className="w-5 h-5" />
      </button>

      {/* Play/Pause */}
      <button
        onClick={onPlayPause}
        className="w-9 h-9 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-md"
      >
        {isPlaying ? (
          <FiPause className="text-white w-4 h-4" />
        ) : (
          <FiPlay className="text-white w-4 h-4 ml-0.5" />
        )}
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        className="text-gray-600 hover:text-gray-900 transition-colors"
      >
        <FiSkipForward className="w-5 h-5" />
      </button>

      {/* Repeat */}
      <button onClick={onRepeatToggle} className="hidden md:block relative">
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
  );
}
