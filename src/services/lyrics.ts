import type { LyricLine } from '../types/music';

const API_BASE_URL = 'http://localhost:8000';

interface LyricsResponse {
    lyrics: LyricLine[] | string | null;
    hasTimestamps: boolean;
    source: string | null;
    error: string | null;
}

export async function getLyrics(browseId: string): Promise<LyricsResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/lyrics/${browseId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch lyrics:', error);
        return {
            lyrics: null,
            hasTimestamps: false,
            source: null,
            error: '가사를 가져오는 중 오류가 발생했습니다.',
        };
    }
}
