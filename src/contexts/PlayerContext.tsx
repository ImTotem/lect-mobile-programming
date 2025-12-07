import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import type { Song } from '../types/music';
import { getSongStreamUrl } from '../services/ytmusic';

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
  const [volume, setVolumeState] = useState(70);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 오디오 정리 함수
  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  };

  // 오디오 설정 함수
  const setupAudio = (audio: HTMLAudioElement) => {
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
      // 자동으로 다음 곡 재생
      if (currentIndex < queue.length - 1) {
        playNext();
      }
    });

    audio.addEventListener('error', (e) => {
      console.error('재생 오류:', e);
      setIsPlaying(false);
      alert('음악을 재생할 수 없습니다. 다른 곡을 선택해주세요.');
    });
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
      }
      // Spotify preview URL을 사용하는 경우 (폴백)
      else if (song.previewUrl) {
        streamUrl = song.previewUrl;
      }

      if (!streamUrl) {
        console.error('재생 가능한 URL이 없습니다.');
        alert('이 곡은 현재 재생할 수 없습니다. 다른 곡을 선택해주세요.');
        return;
      }

      // 새 오디오 생성
      const audio = new Audio(streamUrl);
      setupAudio(audio);

      audioRef.current = audio;
      setCurrentSong(song);
      setIsPlaying(true);

      // 큐에 추가
      if (addToQueue) {
        setQueue((prev) => {
          const newQueue = [...prev, song];
          setCurrentIndex(newQueue.length - 1);
          return newQueue;
        });
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

    setQueue(songs);
    setCurrentIndex(startIndex);

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
      } else if (song.previewUrl) {
        streamUrl = song.previewUrl;
      }

      if (!streamUrl) {
        console.error('재생 가능한 URL이 없습니다.');
        alert('이 곡은 현재 재생할 수 없습니다.');
        return;
      }

      const audio = new Audio(streamUrl);
      setupAudio(audio);

      audioRef.current = audio;
      setCurrentSong(song);
      setIsPlaying(true);

      await audio.play();
    } catch (error) {
      console.error('재생 실패:', error);
      setIsPlaying(false);
      alert('음악 재생에 실패했습니다.');
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
        alert('음악 재생에 실패했습니다.');
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

  const playNext = async () => {
    if (queue.length === 0) {
      console.log('큐가 비어있습니다.');
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      console.log('마지막 곡입니다.');
      return;
    }

    setCurrentIndex(nextIndex);
    const nextSong = queue[nextIndex];

    cleanupAudio();

    try {
      let streamUrl: string | null = null;

      if (nextSong.videoId) {
        streamUrl = await getSongStreamUrl(nextSong.videoId as string);
        if (!streamUrl) {
          console.error('스트리밍 URL을 가져올 수 없습니다.');
          return;
        }
      } else if (nextSong.previewUrl) {
        streamUrl = nextSong.previewUrl;
      }

      if (!streamUrl) {
        console.error('재생 가능한 URL이 없습니다.');
        return;
      }

      const audio = new Audio(streamUrl);
      setupAudio(audio);

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
    if (queue.length === 0) {
      console.log('큐가 비어있습니다.');
      return;
    }

    // 현재 재생 시간이 3초 이상이면 처음부터 재생
    if (currentTime > 3) {
      seek(0);
      return;
    }

    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      console.log('첫 번째 곡입니다.');
      seek(0);
      return;
    }

    setCurrentIndex(prevIndex);
    const prevSong = queue[prevIndex];

    cleanupAudio();

    try {
      let streamUrl: string | null = null;

      if (prevSong.videoId) {
        streamUrl = await getSongStreamUrl(prevSong.videoId as string);
        if (!streamUrl) {
          console.error('스트리밍 URL을 가져올 수 없습니다.');
          return;
        }
      } else if (prevSong.previewUrl) {
        streamUrl = prevSong.previewUrl;
      }

      if (!streamUrl) {
        console.error('재생 가능한 URL이 없습니다.');
        return;
      }

      const audio = new Audio(streamUrl);
      setupAudio(audio);

      audioRef.current = audio;
      setCurrentSong(prevSong);
      setIsPlaying(true);

      await audio.play();
    } catch (error) {
      console.error('이전 곡 재생 실패:', error);
      setIsPlaying(false);
    }
  };

  const addToQueue = (song: Song) => {
    setQueue((prev) => [...prev, song]);
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(0);
  };

  // 컴포넌트 언마운트 시 오디오 정리
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

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
        addToQueue,
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
