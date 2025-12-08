import type { Song } from '../types/music';

export interface VideoResult {
  videoId: string;
  title: string;
  author: string;
  authorId: string;
  videoThumbnails: Array<{
    quality: string;
    url: string;
    width: number;
    height: number;
  }>;
  lengthSeconds: number;
  viewCount: number;
}

export interface SearchResponse {
  type: string;
  title: string;
  videoId: string;
  author: string;
  authorId: string;
  videoThumbnails: Array<{
    quality: string;
    url: string;
    width: number;
    height: number;
  }>;
  lengthSeconds: number;
  viewCount: number;
}

// Invidious 인스턴스
const INVIDIOUS_API = 'https://invidious.privacyredirect.com/api/v1';

// CORS 프록시 목록
const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
];

let currentProxyIndex = 0;

// 프록시를 통해 fetch 시도
async function fetchWithProxy(url: string): Promise<Response> {
  const errors: Error[] = [];

  // 모든 프록시 시도
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxyIndex = (currentProxyIndex + i) % CORS_PROXIES.length;
    const proxyUrl = CORS_PROXIES[proxyIndex](url);

    try {

      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // allorigins는 JSON으로 래핑되어 있음
      if (proxyIndex === 0) {
        const data = await response.json();
        const contents = JSON.parse(data.contents);
        // 성공하면 다음에도 이 프록시 사용
        currentProxyIndex = proxyIndex;
        return new Response(JSON.stringify(contents), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // thingproxy는 직접 반환
        currentProxyIndex = proxyIndex;
        return response;
      }
    } catch (error) {
      console.warn(`Proxy ${proxyIndex + 1} failed:`, error);
      errors.push(error as Error);
    }
  }

  // 모든 프록시 실패
  throw new Error(`All proxies failed: ${errors.map((e) => e.message).join(', ')}`);
}

// 음악 검색
export async function searchMusic(query: string): Promise<Song[]> {
  try {
    const url = `${INVIDIOUS_API}/search?q=${encodeURIComponent(query + ' music')}&type=video`;
    const response = await fetchWithProxy(url);
    const data: SearchResponse[] = await response.json();

    return data
      .filter((item) => item.type === 'video')
      .slice(0, 20)
      .map((item) => ({
        id: item.videoId,
        title: item.title,
        artist: item.author,
        album: item.author,
        thumbnail: getThumbnailUrl(item.videoThumbnails),
        duration: formatDuration(item.lengthSeconds),
        videoId: item.videoId,
      }));
  } catch (error) {
    return [];
  }
}

// 인기 음악 가져오기
export async function getTrendingMusic(): Promise<Song[]> {
  try {
    const url = `${INVIDIOUS_API}/trending?type=music`;
    const response = await fetchWithProxy(url);
    const data: SearchResponse[] = await response.json();

    return data.slice(0, 20).map((item) => ({
      id: item.videoId,
      title: item.title,
      artist: item.author,
      album: item.author,
      thumbnail: getThumbnailUrl(item.videoThumbnails),
      duration: formatDuration(item.lengthSeconds),
      videoId: item.videoId,
    }));
  } catch (error) {
    return [];
  }
}

// 비디오 스트리밍 URL 가져오기
export async function getStreamUrl(videoId: string): Promise<string | null> {
  try {
    const url = `${INVIDIOUS_API}/videos/${videoId}`;
    const response = await fetchWithProxy(url);
    const data = await response.json();

    // 오디오 포맷 찾기
    const audioFormat = data.adaptiveFormats?.find(
      (format: any) => format.type?.includes('audio')
    );

    return audioFormat?.url || null;
  } catch (error) {
    return null;
  }
}

// 초를 시간 형식으로 변환
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 썸네일 URL 가져오기 (최고 화질)
export function getThumbnailUrl(
  thumbnails: Array<{ quality: string; url: string }>
): string {
  const highQuality = thumbnails.find(
    (t) => t.quality === 'maxres' || t.quality === 'maxresdefault'
  );
  return highQuality?.url || thumbnails[thumbnails.length - 1]?.url || '';
}
