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
            // 재생 중지
            try {
                audioRef.current.pause();
            } catch (e) {
                // 이미 정지된 경우 무시
            }

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

            // 오디오 소스 제거 및 리소스 해제
            audioRef.current.src = '';
            audioRef.current.load();
            audioRef.current = null;
        }
        handlersRef.current = {};

        // 추가 안전장치: 페이지의 모든 audio 요소 정지
        const allAudios = document.querySelectorAll('audio');
        allAudios.forEach(audio => {
            try {
                audio.pause();
                audio.src = '';
            } catch (e) {
                // 무시
            }
        });
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
