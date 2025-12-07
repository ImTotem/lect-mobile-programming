import { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { SongInfo, PlayerControls, ProgressBar, VolumeControl } from './index';

interface PlayerBarProps {
  onExpand: () => void;
}

export default function PlayerBar({ onExpand }: PlayerBarProps) {
  const {
    currentSong,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    repeatMode,
    togglePlay,
    setVolume,
    seek,
    playNext,
    playPrevious,
    setRepeatMode,
  } = usePlayer();

  const [isShuffle, setIsShuffle] = useState(false);

  const handleRepeatToggle = () => {
    setRepeatMode(
      repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off'
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white">
      <ProgressBar currentTime={currentTime} duration={duration} onChange={seek} />

      <div
        className="max-w-screen-2xl mx-auto px-4 h-20"
        onClick={onExpand}
      >
        <div className="flex items-center gap-4 h-full">
          {/* Left: Song Info - flex-1 to take equal space */}
          <div className="flex-1 min-w-0">
            {currentSong ? (
              <SongInfo
                title={currentSong.title}
                artist={currentSong.artist}
                thumbnail={currentSong.thumbnail}
              />
            ) : (
              <div className="text-gray-400 text-sm">
                재생 중인 음악이 없습니다
              </div>
            )}
          </div>

          {/* Center: Player Controls - fixed width, centered */}
          <div onClick={(e) => e.stopPropagation()}>
            <PlayerControls
              isPlaying={isPlaying}
              isLoading={isLoading}
              isShuffle={isShuffle}
              repeatMode={repeatMode}
              currentTime={currentTime}
              duration={duration}
              onPlayPause={togglePlay}
              onPrevious={playPrevious}
              onNext={playNext}
              onShuffleToggle={() => setIsShuffle(!isShuffle)}
              onRepeatToggle={handleRepeatToggle}
            />
          </div>

          {/* Right: Volume Control - fixed width */}
          <div className="flex-1 flex justify-end">
            <div onClick={(e) => e.stopPropagation()}>
              <VolumeControl volume={volume} onChange={setVolume} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
