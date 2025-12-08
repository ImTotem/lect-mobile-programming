import type { Song, Playlist } from '../types/music';

const YTMUSIC_API_URL = import.meta.env.VITE_YTMUSIC_API_URL || 'http://localhost:8000';

/**
 * YouTube Music API 호출 헬퍼 함수
 */
async function ytmusicFetch(endpoint: string): Promise<any> {
  const response = await fetch(`${YTMUSIC_API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * 음악 검색
 */
export async function searchMusic(query: string): Promise<Song[]> {
  try {
    const data = await ytmusicFetch(`/api/search?q=${encodeURIComponent(query)}&limit=20`);
    return data.results || [];
  } catch (error) {
    return [];
  }
}

/**
 * 검색어 자동완성 (추천 검색어)
 */
export async function getSearchSuggestions(query: string): Promise<string[]> {
  try {
    const data = await ytmusicFetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
    return data.results || [];
  } catch (error) {
    return [];
  }
}

// ... existing imports ...

/**
 * 차트 목록 가져오기 (Explore Page용)
 */
export async function getChartList(): Promise<any[]> {
  try {
    const data = await ytmusicFetch('/api/charts/list');
    return data.results || [];
  } catch (error) {
    return [];
  }
}

/**
 * 분위기/장르 상세 플레이리스트 가져오기
 */
export async function getMoodPlaylists(params: string): Promise<Playlist[]> {
  try {
    const data = await ytmusicFetch(`/api/moods/playlists?params=${encodeURIComponent(params)}`);
    return data.results || [];
  } catch (error) {
    return [];
  }
}

/**
 * 인기 차트 가져오기 (Home Page용 - 곡 리스트 반환)
 */
export async function getTrendingMusic(): Promise<Song[]> {
  try {
    const data = await ytmusicFetch('/api/charts?limit=20');
    return data.results || [];
  } catch (error) {
    return [];
  }
}

/**
 * 추천 플레이리스트 가져오기
 */
export async function getFeaturedPlaylists(): Promise<Playlist[]> {
  try {
    const data = await ytmusicFetch('/api/playlists/featured?limit=10');
    return data.results || [];
  } catch (error) {
    return [];
  }
}

/**
 * 플레이리스트 트랙 가져오기
 */
export async function getPlaylistTracks(playlistId: string | number): Promise<Song[]> {
  try {
    const data = await ytmusicFetch(`/api/playlists/${playlistId}?limit=50`);
    return data.tracks || [];
  } catch (error) {
    return [];
  }
}

/**
 * 플레이리스트 상세 정보 가져오기
 */
export async function getPlaylist(playlistId: string | number): Promise<Playlist | null> {
  try {
    const data = await ytmusicFetch(`/api/playlists/${playlistId}?limit=50`);
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail,
      tracksCount: data.tracksCount
    };
  } catch (error) {
    return null;
  }
}

/**
 * 노래 스트리밍 URL 가져오기
 */
export async function getSongStreamUrl(videoId: string): Promise<string | null> {
  try {
    const data = await ytmusicFetch(`/api/songs/${videoId}`);
    return data.streamUrl || null;
  } catch (error) {
    return null;
  }
}

/**
 * 곡 전체 정보 가져오기 (lyricsBrowseId 포함)
 */
export async function getSongInfo(videoId: string): Promise<any> {
  try {
    const data = await ytmusicFetch(`/api/songs/${videoId}`);
    return data;
  } catch (error) {
    return null;
  }
}

/**
 * 초를 시간 형식으로 변환
 */
export function formatDuration(seconds: number | string): string {
  const sec = typeof seconds === 'string' ? parseInt(seconds) : seconds;
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 오디오 재생 (YouTube Music 스트리밍)
 */
export async function playAudio(videoId: string): Promise<HTMLAudioElement | null> {
  try {
    const streamUrl = await getSongStreamUrl(videoId);
    if (!streamUrl) return null;

    const audio = new Audio(streamUrl);
    await audio.play();
    return audio;
  } catch (error) {
    throw error;
  }
}

/**
 * 분위기 및 장르 카테고리 가져오기
 */
export async function getMoodCategories(): Promise<any> {
  try {
    const data = await ytmusicFetch('/api/moods');
    return data;
  } catch (error) {
    return [];
  }
}
