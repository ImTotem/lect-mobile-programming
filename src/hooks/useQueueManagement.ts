import { useState, useCallback } from 'react';
import type { Song } from '../types/music';

/**
 * 재생 큐 관리를 담당하는 hook
 */
export function useQueueManagement() {
    const [queue, setQueue] = useState<Song[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    /**
     * 큐에 곡 추가
     */
    const addToQueue = useCallback((song: Song) => {
        setQueue((prev) => [...prev, song]);
    }, []);

    /**
     * 큐 초기화
     */
    const clearQueue = useCallback(() => {
        setQueue([]);
        setCurrentIndex(0);
    }, []);

    /**
     * 큐 설정 및 인덱스 지정
     */
    const setQueueWithIndex = useCallback((songs: Song[], index: number) => {
        setQueue(songs);
        setCurrentIndex(index);
    }, []);

    /**
     * 다음 곡으로 이동
     */
    const moveToNext = useCallback((): Song | null => {
        if (currentIndex < queue.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            return queue[nextIndex];
        }
        return null;
    }, [currentIndex, queue]);

    /**
     * 이전 곡으로 이동
     */
    const moveToPrevious = useCallback((): Song | null => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            return queue[prevIndex];
        }
        return null;
    }, [currentIndex, queue]);

    /**
     * 현재 곡 가져오기
     */
    const getCurrentSong = useCallback((): Song | null => {
        return queue[currentIndex] || null;
    }, [queue, currentIndex]);

    return {
        queue,
        currentIndex,
        addToQueue,
        clearQueue,
        setQueueWithIndex,
        moveToNext,
        moveToPrevious,
        getCurrentSong,
    };
}
