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
import { getSongStreamUrl, getSongInfo } from '../services/ytmusic';
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

  // 최신 queue와 currentIndex를 참조하기 위한 ref (이벤트 핸들러에서 사용)
  const queueRef = useRef(queue);
  const currentIndexRef = useRef(currentIndex);
  const repeatModeRef = useRef(repeatMode);

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
    // 진행 중인 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새 AbortController 생성
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // 이미 로딩 중이면 현재 오디오 정리하고 계속 진행
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

    // UI 먼저 업데이트 (즉각적인 반응)
    setCurrentSong(nextSong);
    setIsPlaying(false);
    setIsLoading(true);

    cleanupAudio();

    try {
      let streamUrl: string | null = null;

      if (nextSong.videoId) {
        // 전체 곡 정보 가져오기 (lyricsBrowseId 포함)
        const songInfo = await getSongInfo(nextSong.videoId as string);

        // 요청이 취소되었는지 확인
        if (abortController.signal.aborted) {
          return;
        }

        if (!songInfo || !songInfo.streamUrl) {
          console.error('스트리밍 URL을 가져올 수 없습니다.');
          setIsLoading(false);
          return;
        }

        streamUrl = songInfo.streamUrl;

        // lyricsBrowseId를 currentSong에 업데이트
        const updatedSong = {
          ...nextSong,
          lyricsBrowseId: songInfo.lyricsBrowseId
        };
        setCurrentSong(updatedSong);
      } else {
        console.error('재생 가능한 URL이 없습니다.');
        setIsLoading(false);
        return;
      }

      // 다시 한번 취소 확인
      if (abortController.signal.aborted) {
        return;
      }

      // 오디오 로딩 및 재생
      const audio = createAudio(streamUrl!, getAudioHandlers());
      audioRef.current = audio;
      setIsLoading(false);
      setIsPlaying(true);

      await audio.play();
    } catch (error) {
      // AbortError는 무시
      if (abortController.signal.aborted) {
        return;
      }
      console.error('다음 곡 재생 실패:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [moveToNext, repeatMode, queue, setQueueWithIndex, cleanupAudio, createAudio, audioRef, currentIndex, isLoading]);

  // playNext 참조 업데이트
  playNextRef.current = playNext;

  // 오디오 이벤트 핸들러들 - playNext 이후에 정의
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
      // ref를 통해 최신 값 참조
      const latestQueue = queueRef.current;
      const latestIndex = currentIndexRef.current;
      const latestRepeatMode = repeatModeRef.current;

      setIsPlaying(false);
      setCurrentTime(0);

      // 연속 재생 로직
      if (latestRepeatMode === 'one') {
        // 한 곡 반복: 같은 곡 다시 재생
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else if (latestRepeatMode === 'all') {
        // 전체 반복: 다음 곡 재생 (마지막 곡이면 처음으로)
        playNextRef.current?.();
      } else {
        // 반복 없음: 마지막 곡이 아니면 다음 곡 재생
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
    // 재생 상태 먼저 정지
    setIsPlaying(false);

    // UI 먼저 업데이트 (즉각적인 반응)
    setCurrentSong(song);
    setIsLoading(true);

    cleanupAudio();

    try {
      let streamUrl: string | null = null;

      // YouTube Music API를 사용하는 경우
      if (song.videoId) {
        // 전체 곡 정보 가져오기 (lyricsBrowseId 포함)
        const songInfo = await getSongInfo(song.videoId as string);

        if (!songInfo || !songInfo.streamUrl) {
          console.error('스트리밍 URL을 가져올 수 없습니다.');
          alert('이 곡은 현재 재생할 수 없습니다. 다른 곡을 선택해주세요.');
          setIsLoading(false);
          return;
        }

        streamUrl = songInfo.streamUrl;

        // lyricsBrowseId를 currentSong에 업데이트
        const updatedSong = {
          ...song,
          lyricsBrowseId: songInfo.lyricsBrowseId
        };
        setCurrentSong(updatedSong);

        // 큐에 추가할 때도 업데이트된 정보 사용
        if (addToQueue) {
          addSongToQueue(updatedSong);
        }
      } else {
        console.error('재생 가능한 URL이 없습니다.');
        alert('이 곡은 현재 재생할 수 없습니다. 다른 곡을 선택해주세요.');
        setIsLoading(false);
        return;
      }

      // 새 오디오 생성
      const audio = createAudio(streamUrl!, getAudioHandlers());
      audioRef.current = audio;
      setIsLoading(false);
      setIsPlaying(true);

      await audio.play();
    } catch (error) {
      console.error('재생 실패:', error);
      setIsLoading(false);
      setIsPlaying(false);
      alert('음악 재생에 실패했습니다. 다른 곡을 선택해주세요.');
    }
  };

  const playQueue = async (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    // 이전 로딩 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새 AbortController 생성
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setQueueWithIndex(songs, startIndex);
    const song = songs[startIndex];

    // UI 먼저 업데이트 (즉각적인 반응)
    setCurrentSong(song);
    setIsPlaying(false);
    setIsLoading(true);

    cleanupAudio();

    try {
      let streamUrl: string | null = null;

      if (song.videoId) {
        // 전체 곡 정보 가져오기 (lyricsBrowseId 포함)
        const songInfo = await getSongInfo(song.videoId as string);

        // 취소 확인
        if (abortController.signal.aborted) {
          return;
        }

        if (!songInfo || !songInfo.streamUrl) {
          console.error('스트리밍 URL을 가져올 수 없습니다.');
          alert('이 곡은 현재 재생할 수 없습니다.');
          setIsLoading(false);
          return;
        }

        streamUrl = songInfo.streamUrl;

        // lyricsBrowseId를 currentSong에 업데이트
        const updatedSong = {
          ...song,
          lyricsBrowseId: songInfo.lyricsBrowseId
        };
        setCurrentSong(updatedSong);
      } else {
        console.error('재생 가능한 URL이 없습니다.');
        alert('이 곡은 현재 재생할 수 없습니다.');
        setIsLoading(false);
        return;
      }

      // 다시 한번 취소 확인
      if (abortController.signal.aborted) {
        return;
      }

      const audio = createAudio(streamUrl!, getAudioHandlers());
      audioRef.current = audio;
      setIsLoading(false);
      setIsPlaying(true);

      await audio.play();
    } catch (error) {
      // AbortError는 무시
      if (abortController.signal.aborted) {
        return;
      }
      console.error('큐 재생 실패:', error);
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
      // 새로고침 후 오디오 객체가 없으면 현재 곡 다시 로드
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
    // 진행 중인 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새 AbortController 생성
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // 이미 로딩 중이면 현재 오디오 정리하고 계속 진행
    if (isLoading) {
      cleanupAudio();
    }

    const prevSong = moveToPrevious();
    if (!prevSong) return;

    // UI 먼저 업데이트
    setCurrentSong(prevSong);
    setIsPlaying(false);
    setIsLoading(true);

    cleanupAudio();

    try {
      let streamUrl: string | null = null;

      if (prevSong.videoId) {
        // 전체 곡 정보 가져오기 (lyricsBrowseId 포함)
        const songInfo = await getSongInfo(prevSong.videoId as string);

        // 요청이 취소되었는지 확인
        if (abortController.signal.aborted) {
          return;
        }

        if (!songInfo || !songInfo.streamUrl) {
          console.error('스트리밍 URL을 가져올 수 없습니다.');
          setIsLoading(false);
          return;
        }

        streamUrl = songInfo.streamUrl;

        // lyricsBrowseId를 currentSong에 업데이트
        const updatedSong = {
          ...prevSong,
          lyricsBrowseId: songInfo.lyricsBrowseId
        };
        setCurrentSong(updatedSong);
      } else {
        console.error('재생 가능한 URL이 없습니다.');
        setIsLoading(false);
        return;
      }

      // 다시 한번 취소 확인
      if (abortController.signal.aborted) {
        return;
      }

      const audio = createAudio(streamUrl!, getAudioHandlers());
      audioRef.current = audio;
      setIsLoading(false);
      setIsPlaying(true);

      await audio.play();
    } catch (error) {
      // AbortError는 무시
      if (abortController.signal.aborted) {
        return;
      }
      console.error('이전 곡 재생 실패:', error);
      setIsLoading(false);
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
        isLoading,
        currentTime,
        duration,
        volume,
        queue,
        currentIndex,
        repeatMode,
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
