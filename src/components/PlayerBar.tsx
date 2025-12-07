import { useState } from 'react';
import ProgressBar from './ProgressBar';
import SongInfo from './SongInfo';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import { usePlayer } from '../contexts';

export default function PlayerBar() {
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

      <div className="max-w-screen-2xl mx-auto px-4 h-20">
        <div className="flex items-center justify-between gap-4 h-full">
          {currentSong ? (
            <SongInfo
              title={currentSong.title}
              artist={currentSong.artist}
              thumbnail={currentSong.thumbnail}
            />
          ) : (
            <div className="flex-1 min-w-0 max-w-xs text-gray-400 text-sm">
              재생 중인 음악이 없습니다
            </div>
          )}

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

          <VolumeControl volume={volume} onChange={setVolume} />
        </div>
      </div>
    </div>
  );
}
