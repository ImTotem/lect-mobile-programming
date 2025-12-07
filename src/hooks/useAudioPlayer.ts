import { useRef, useCallback } from 'react';

interface AudioEventHandlers {
    onLoadedMetadata: () => void;
    onTimeUpdate: () => void;
    onEnded: () => void;
    onError: (e: Event) => void;
}

/**
 * 오디오 객체 관리 및 이벤트 핸들링을 담당하는 hook
 */
export function useAudioPlayer(volume: number) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const handlersRef = useRef<{
        loadedmetadata?: () => void;
        timeupdate?: () => void;
        ended?: () => void;
        error?: (e: Event) => void;
    }>({});

    /**
     * 오디오 정리 함수
     */
    const cleanupAudio = useCallback(() => {
        if (audioRef.current) {
            // 저장된 이벤트 리스너 제거
            if (handlersRef.current.loadedmetadata) {
                audioRef.current.removeEventListener('loadedmetadata', handlersRef.current.loadedmetadata);
            }
            if (handlersRef.current.timeupdate) {
                audioRef.current.removeEventListener('timeupdate', handlersRef.current.timeupdate);
            }
            if (handlersRef.current.ended) {
                audioRef.current.removeEventListener('ended', handlersRef.current.ended);
            }
            if (handlersRef.current.error) {
                audioRef.current.removeEventListener('error', handlersRef.current.error);
            }

            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current.load(); // 리소스 해제
            audioRef.current = null;
        }
        handlersRef.current = {};
    }, []);

    /**
     * 오디오 설정 함수
     */
    const setupAudio = useCallback((audio: HTMLAudioElement, handlers: AudioEventHandlers) => {
        audio.volume = volume / 100;

        const loadedmetadataHandler = () => {
            handlers.onLoadedMetadata();
        };

        const timeupdateHandler = () => {
            handlers.onTimeUpdate();
        };

        const endedHandler = () => {
            handlers.onEnded();
        };

        const errorHandler = (e: Event) => {
            handlers.onError(e);
        };

        // 핸들러 저장
        handlersRef.current = {
            loadedmetadata: loadedmetadataHandler,
            timeupdate: timeupdateHandler,
            ended: endedHandler,
            error: errorHandler,
        };

        // 이벤트 리스너 등록
        audio.addEventListener('loadedmetadata', loadedmetadataHandler);
        audio.addEventListener('timeupdate', timeupdateHandler);
        audio.addEventListener('ended', endedHandler);
        audio.addEventListener('error', errorHandler);
    }, [volume]);

    /**
     * 새 오디오 생성
     */
    const createAudio = useCallback((streamUrl: string, handlers: AudioEventHandlers): HTMLAudioElement => {
        const audio = new Audio(streamUrl);
        setupAudio(audio, handlers);
        return audio;
    }, [setupAudio]);

    return {
        audioRef,
        cleanupAudio,
        createAudio,
    };
}
