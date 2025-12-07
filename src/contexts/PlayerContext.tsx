import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import type { Song } from '../types/music';
import { getSongStreamUrl } from '../services/ytmusic';
import { useAudioPlayer, useQueueManagement } from '../hooks';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Song[];
  currentIndex: number;
  playSong: (song: Song, addToQueue?: boolean) => void;
  playQueue: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (song: Song) => void;
  clearQueue: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // localStorage에서 저장된 볼륨 불러오기 (기본값 50)
  const [volume, setVolumeState] = useState(() => {
    const savedVolume = localStorage.getItem('playerVolume');
    return savedVolume ? parseInt(savedVolume, 10) : 50;
  });

  // Custom hooks 사용
  const { audioRef, cleanupAudio, createAudio } = useAudioPlayer(volume);
  const {
    queue,
    currentIndex,
    addToQueue: addSongToQueue,
    clearQueue,
    setQueueWithIndex,
    moveToNext,
    moveToPrevious,
  } = useQueueManagement();

  // 오디오 이벤트 핸들러들
  const audioHandlers = {
    onLoadedMetadata: () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    },
    onTimeUpdate: () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    },
    onEnded: () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // 자동으로 다음 곡 재생
      playNext();
    },
    onError: (e: Event) => {
      console.error('재생 오류:', e);
      setIsPlaying(false);
    },
  };

  const playSong = async (song: Song, addToQueue = true) => {
    cleanupAudio();

    try {
      let streamUrl: string | null = null;

      // YouTube Music API를 사용하는 경우
      if (song.videoId) {
        streamUrl = await getSongStreamUrl(song.videoId as string);
        if (!streamUrl) {
          console.error('스트리밍 URL을 가져올 수 없습니다.');
          alert('이 곡은 현재 재생할 수 없습니다. 다른 곡을 선택해주세요.');
          return;
        }
      } else {
        console.error('재생 가능한 URL이 없습니다.');
        alert('이 곡은 현재 재생할 수 없습니다. 다른 곡을 선택해주세요.');
        return;
      }

      // 새 오디오 생성
      const audio = createAudio(streamUrl, audioHandlers);
      audioRef.current = audio;
      setCurrentSong(song);
      setIsPlaying(true);

      // 큐에 추가
      if (addToQueue) {
        addSongToQueue(song);
      }

      await audio.play();
    } catch (error) {
      console.error('재생 실패:', error);
      setIsPlaying(false);
      alert('음악 재생에 실패했습니다. 다른 곡을 선택해주세요.');
    }
  };

  const playQueue = async (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    setQueueWithIndex(songs, startIndex);
    const song = songs[startIndex];

    cleanupAudio();

    try {
      let streamUrl: string | null = null;

      if (song.videoId) {
        streamUrl = await getSongStreamUrl(song.videoId as string);
        if (!streamUrl) {
          console.error('스트리밍 URL을 가져올 수 없습니다.');
          alert('이 곡은 현재 재생할 수 없습니다.');
          return;
        }
      } else {
        console.error('재생 가능한 URL이 없습니다.');
        alert('이 곡은 현재 재생할 수 없습니다.');
        return;
      }

      const audio = createAudio(streamUrl, audioHandlers);
      audioRef.current = audio;
      setCurrentSong(song);
      setIsPlaying(true);

      await audio.play();
    } catch (error) {
      console.error('큐 재생 실패:', error);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem('playerVolume', newVolume.toString());
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

  const playNext = async () => {
    const nextSong = moveToNext();
    if (!nextSong) return;

    cleanupAudio();

    try {
      let streamUrl: string | null = null;

      if (nextSong.videoId) {
        streamUrl = await getSongStreamUrl(nextSong.videoId as string);
        if (!streamUrl) {
          console.error('스트리밍 URL을 가져올 수 없습니다.');
          return;
        }
      } else {
        console.error('재생 가능한 URL이 없습니다.');
        return;
      }

      const audio = createAudio(streamUrl, audioHandlers);
      audioRef.current = audio;
      setCurrentSong(nextSong);
      setIsPlaying(true);

      await audio.play();
    } catch (error) {
      console.error('다음 곡 재생 실패:', error);
      setIsPlaying(false);
    }
  };

  const playPrevious = async () => {
    const prevSong = moveToPrevious();
    if (!prevSong) return;

    cleanupAudio();

    try {
      let streamUrl: string | null = null;

      if (prevSong.videoId) {
        streamUrl = await getSongStreamUrl(prevSong.videoId as string);
        if (!streamUrl) {
          console.error('스트리밍 URL을 가져올 수 없습니다.');
          return;
        }
      } else {
        console.error('재생 가능한 URL이 없습니다.');
        return;
      }

      const audio = createAudio(streamUrl, audioHandlers);
      audioRef.current = audio;
      setCurrentSong(prevSong);
      setIsPlaying(true);

      await audio.play();
    } catch (error) {
      console.error('이전 곡 재생 실패:', error);
      setIsPlaying(false);
    }
  };

  // 컴포넌트 언마운트 시 오디오 정리
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        currentIndex,
        playSong,
        playQueue,
        togglePlay,
        setVolume,
        seek,
        playNext,
        playPrevious,
        addToQueue: addSongToQueue,
        clearQueue,
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
