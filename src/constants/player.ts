/**
 * localStorage 키 상수
 */
export const STORAGE_KEYS = {
    PLAYER_QUEUE: 'playerQueue',
    PLAYER_CURRENT_INDEX: 'playerCurrentIndex',
    PLAYER_CURRENT_SONG: 'playerCurrentSong',
    PLAYER_REPEAT_MODE: 'playerRepeatMode',
    PLAYER_VOLUME: 'playerVolume',
    SIDEBAR_OPEN: 'sidebar-open',
    CURRENT_PAGE: 'current-page',
} as const;

/**
 * 플레이어 기본값
 */
export const PLAYER_DEFAULTS = {
    VOLUME: 50,
    REPEAT_MODE: 'off' as const,
    CURRENT_INDEX: 0,
} as const;
