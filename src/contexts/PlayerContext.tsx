import { createContext, useContext, useState, useRef, ReactNode } from 'react';
import type { Song } from '../types/music';
import { getSongStreamUrl } from '../services/ytmusic';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  playNext: () => void;
  playPrevious: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(70);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSong = async (song: Song) => {
    // 이전 오디오 정리
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      // YouTube Music API를 사용하는 경우
      if (song.videoId) {
        const streamUrl = await getSongStreamUrl(song.videoId as string);
        if (!streamUrl) {
          console.error('스트리밍 URL을 가져올 수 없습니다.');
          return;
        }

        // 새 오디오 생성
        const audio = new Audio(streamUrl);
        audio.volume = volume / 100;

        // 이벤트 리스너
        audio.addEventListener('loadedmetadata', () => {
          setDuration(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
          setCurrentTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
          setIsPlaying(false);
          setCurrentTime(0);
        });

        audio.addEventListener('error', (e) => {
          console.error('재생 오류:', e);
          setIsPlaying(false);
        });

        audioRef.current = audio;
        setCurrentSong(song);
        setIsPlaying(true);
        
        await audio.play();
      } 
      // Spotify preview URL을 사용하는 경우 (폴백)
      else if (song.previewUrl) {
        const audio = new Audio(song.previewUrl);
        audio.volume = volume / 100;

        audio.addEventListener('loadedmetadata', () => {
          setDuration(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
          setCurrentTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
          setIsPlaying(false);
          setCurrentTime(0);
        });

        audio.addEventListener('error', (e) => {
          console.error('재생 오류:', e);
          setIsPlaying(false);
        });

        audioRef.current = audio;
        setCurrentSong(song);
        setIsPlaying(true);
        
        await audio.play();
      }
    } catch (error) {
      console.error('재생 실패:', error);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((error) => {
        console.error('재생 실패:', error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const playNext = () => {
    console.log('다음 곡 재생');
    // TODO: 플레이리스트 구현 후 다음 곡 재생
  };

  const playPrevious = () => {
    console.log('이전 곡 재생');
    // TODO: 플레이리스트 구현 후 이전 곡 재생
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        playSong,
        togglePlay,
        setVolume,
        seek,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}
