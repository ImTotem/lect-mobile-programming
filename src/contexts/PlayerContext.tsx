import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import type { ReactNode } from 'react';
import type { Song } from '../types/music';
import { getSongInfo } from '../services/ytmusic';
import { useAudioPlayer, useQueueManagement } from '../hooks';
import { getStorageItem, setStorageItem } from '../utils';
import { STORAGE_KEYS, PLAYER_DEFAULTS } from '../constants';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Song[];
  currentIndex: number;
  repeatMode: 'off' | 'all' | 'one';
  isShuffle: boolean;
  playSong: (song: Song, addToQueue?: boolean) => void;
  playQueue: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (song: Song) => void;
  clearQueue: () => void;
  setRepeatMode: (mode: 'off' | 'all' | 'one') => void;
  toggleShuffle: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  // localStorage에서 현재 곡 불러오기
  const [currentSong, setCurrentSong] = useState<Song | null>(() =>
    getStorageItem<Song | null>(STORAGE_KEYS.PLAYER_CURRENT_SONG, null)
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // localStorage에서 반복 모드 불러오기
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>(() =>
    getStorageItem<'off' | 'all' | 'one'>(STORAGE_KEYS.PLAYER_REPEAT_MODE, PLAYER_DEFAULTS.REPEAT_MODE)
  );

  // localStorage에서 저장된 볼륨 불러오기
  const [volume, setVolumeState] = useState(() =>
    getStorageItem<number>(STORAGE_KEYS.PLAYER_VOLUME, PLAYER_DEFAULTS.VOLUME)
  );

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

  // 최신 queue와 currentIndex를 참조하기 위한 ref
  const queueRef = useRef(queue);
  const currentIndexRef = useRef(currentIndex);
  const repeatModeRef = useRef(repeatMode);

  // 셔플 관련 상태 및 refs
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const originalQueueRef = useRef<Song[]>([]);

  // 진행 중인 로딩 취소를 위한 ref
  const abortControllerRef = useRef<AbortController | null>(null);

  // queue, currentIndex, repeatMode가 변경될 때마다 ref 업데이트
  useEffect(() => {
    queueRef.current = queue;
    currentIndexRef.current = currentIndex;
    repeatModeRef.current = repeatMode;
  }, [queue, currentIndex, repeatMode]);

  // currentSong이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (currentSong) {
      setStorageItem(STORAGE_KEYS.PLAYER_CURRENT_SONG, currentSong);
    }
  }, [currentSong]);

  // repeatMode가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.PLAYER_REPEAT_MODE, repeatMode);
  }, [repeatMode]);

  // playNext 참조를 저장 (순환 참조 방지)
  const playNextRef = useRef<(() => Promise<void>) | null>(null);

  // playNext를 먼저 정의 (audioHandlers에서 사용)
  const playNext = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    if (isLoading) {
      cleanupAudio();
    }

    let nextSong = moveToNext();

    // 반복 모드가 'all'이고 마지막 곡인 경우 처음으로
    if (!nextSong && repeatMode === 'all' && queue.length > 0) {
      setQueueWithIndex(queue, 0);
      nextSong = queue[0];
    }

    if (!nextSong) return;

    setCurrentSong(nextSong);
    setIsPlaying(false);
    setIsLoading(true);

    cleanupAudio();

    try {
      let streamUrl: string | null = null;
      if (nextSong.videoId) {
        const songInfo = await getSongInfo(nextSong.videoId as string);
        if (abortController.signal.aborted) return;

        if (!songInfo || !songInfo.streamUrl) {
          setIsLoading(false);
          return;
        }

        streamUrl = songInfo.streamUrl;
        const updatedSong = {
          ...nextSong,
          lyricsBrowseId: songInfo.lyricsBrowseId
        };
        setCurrentSong(updatedSong);
      } else {
        setIsLoading(false);
        return;
      }

      if (abortController.signal.aborted) return;

      const audio = createAudio(streamUrl!, getAudioHandlers());
      audioRef.current = audio;
      setIsLoading(false);
      setIsPlaying(true);

      await audio.play();
    } catch (error) {
      if (abortController.signal.aborted) return;
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [moveToNext, repeatMode, queue, setQueueWithIndex, cleanupAudio, createAudio, audioRef, currentIndex, isLoading]);

  playNextRef.current = playNext;

  const getAudioHandlers = useCallback(() => ({
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
      const latestQueue = queueRef.current;
      const latestIndex = currentIndexRef.current;
      const latestRepeatMode = repeatModeRef.current;

      setIsPlaying(false);
      setCurrentTime(0);

      // 연속 재생 로직
      if (latestRepeatMode === 'one') {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else if (latestRepeatMode === 'all') {
        playNextRef.current?.();
      } else {
        if (latestIndex < latestQueue.length - 1) {
          playNextRef.current?.();
        }
      }
    },
    onError: (e: Event) => {
      console.error('재생 오류:', e);
      setIsPlaying(false);
    },
  }), [audioRef]);

  const playSong = async (song: Song, addToQueue = true) => {
    setIsPlaying(false);
    setCurrentSong(song);
    setIsLoading(true);

    cleanupAudio();

    try {
      let streamUrl: string | null = null;
      if (song.videoId) {
        const songInfo = await getSongInfo(song.videoId as string);
        if (!songInfo || !songInfo.streamUrl) {
          alert('이 곡은 현재 재생할 수 없습니다.');
          setIsLoading(false);
          return;
        }
        streamUrl = songInfo.streamUrl;
        const updatedSong = { ...song, lyricsBrowseId: songInfo.lyricsBrowseId };
        setCurrentSong(updatedSong);
        if (addToQueue) addSongToQueue(updatedSong);
      } else {
        setIsLoading(false);
        return;
      }

      const audio = createAudio(streamUrl!, getAudioHandlers());
      audioRef.current = audio;
      setIsLoading(false);
      setIsPlaying(true);
      await audio.play();
    } catch (error) {
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const playQueue = async (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    // 셔플 초기화
    setIsShuffle(false);
    originalQueueRef.current = [];

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setQueueWithIndex(songs, startIndex);
    const song = songs[startIndex];

    setCurrentSong(song);
    setIsPlaying(false);
    setIsLoading(true);
    cleanupAudio();

    try {
      let streamUrl: string | null = null;
      if (song.videoId) {
        const songInfo = await getSongInfo(song.videoId as string);
        if (abortController.signal.aborted) return;
        if (!songInfo || !songInfo.streamUrl) {
          setIsLoading(false);
          return;
        }
        streamUrl = songInfo.streamUrl;
        const updatedSong = { ...song, lyricsBrowseId: songInfo.lyricsBrowseId };
        setCurrentSong(updatedSong);
      } else {
        setIsLoading(false);
        return;
      }

      if (abortController.signal.aborted) return;
      const audio = createAudio(streamUrl!, getAudioHandlers());
      audioRef.current = audio;
      setIsLoading(false);
      setIsPlaying(true);
      await audio.play();
    } catch (error) {
      if (abortController.signal.aborted) return;
      setIsLoading(false);
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
    } else if (currentSong) {
      playSong(currentSong, false);
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

  const playPrevious = async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    if (isLoading) cleanupAudio();

    const prevSong = moveToPrevious();
    if (!prevSong) return;

    setCurrentSong(prevSong);
    setIsPlaying(false);
    setIsLoading(true);
    cleanupAudio();

    try {
      let streamUrl: string | null = null;
      if (prevSong.videoId) {
        const songInfo = await getSongInfo(prevSong.videoId as string);
        if (abortController.signal.aborted) return;
        if (!songInfo || !songInfo.streamUrl) {
          setIsLoading(false);
          return;
        }
        streamUrl = songInfo.streamUrl;
        const updatedSong = { ...prevSong, lyricsBrowseId: songInfo.lyricsBrowseId };
        setCurrentSong(updatedSong);
      } else {
        setIsLoading(false);
        return;
      }

      if (abortController.signal.aborted) return;
      const audio = createAudio(streamUrl!, getAudioHandlers());
      audioRef.current = audio;
      setIsLoading(false);
      setIsPlaying(true);
      await audio.play();
    } catch (error) {
      if (abortController.signal.aborted) return;
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const newShuffleState = !prev;
      if (newShuffleState) {
        if (queue.length > 0) {
          originalQueueRef.current = [...queue];
          const currentSong = queue[currentIndex];
          const remainingSongs = queue.filter((_, index) => index !== currentIndex);
          for (let i = remainingSongs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remainingSongs[i], remainingSongs[j]] = [remainingSongs[j], remainingSongs[i]];
          }
          if (currentIndex === -1) {
            setQueueWithIndex(remainingSongs, -1);
          } else {
            const newQueue = [currentSong, ...remainingSongs];
            setQueueWithIndex(newQueue, 0);
          }
        }
      } else {
        if (originalQueueRef.current.length > 0) {
          const currentSong = queue[currentIndex];
          const originalIndex = originalQueueRef.current.findIndex(s => s.id === currentSong?.id);
          setQueueWithIndex(originalQueueRef.current, originalIndex !== -1 ? originalIndex : 0);
          originalQueueRef.current = [];
        }
      }
      return newShuffleState;
    });
  }, [queue, currentIndex, setQueueWithIndex]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Global Spacebar Listener for Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        // 입력 요소에 포커스가 있으면 무시
        const activeEl = document.activeElement;
        const isInput = activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement || (activeEl as HTMLElement).isContentEditable;

        if (!isInput) {
          e.preventDefault();
          togglePlay();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        volume,
        queue,
        currentIndex,
        repeatMode,
        isShuffle,
        playSong,
        playQueue,
        togglePlay,
        setVolume,
        seek,
        playNext,
        playPrevious,
        addToQueue: addSongToQueue,
        clearQueue,
        setRepeatMode,
        toggleShuffle,
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
