import type { Song, Playlist } from '../types/music';

// Spotify API 설정
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

let accessToken: string = '';
let tokenExpiry: number = 0;

// Access Token 가져오기 (Client Credentials Flow)
async function getAccessToken(): Promise<string> {
  // 토큰이 유효하면 재사용
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Token error:', error);
      throw new Error('토큰 발급 실패');
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

    console.log('✅ Spotify access token obtained');
    return accessToken;
  } catch (error) {
    console.error('Access token error:', error);
    throw error;
  }
}

// Spotify API 호출
async function spotifyFetch(endpoint: string): Promise<any> {
  const token = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Spotify API error:', error);
    throw new Error(`Spotify API error: ${response.status}`);
  }

  return response.json();
}

// 음악 검색
export async function searchMusic(query: string): Promise<Song[]> {
  try {
    const data = await spotifyFetch(
      `/search?q=${encodeURIComponent(query)}&type=track&limit=20`
    );

    return data.tracks.items.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      album: track.album.name,
      thumbnail: track.album.images[0]?.url || '',
      duration: formatDuration(Math.floor(track.duration_ms / 1000)),
      previewUrl: track.preview_url,
      spotifyUrl: track.external_urls.spotify,
    }));
  } catch (error) {
    console.error('Music search error:', error);
    throw error;
  }
}

// 인기 음악 가져오기 (/tracks 엔드포인트 사용)
export async function getTrendingMusic(): Promise<Song[]> {
  try {
    const data = await spotifyFetch(
      '/playlists/3tUdrnfVjOXbHFvD3sijQ2/tracks?limit=20'
    );

    return data.items
      .filter((item: any) => item.track && !item.is_local)
      .map((item: any) => ({
        id: item.track.id,
        title: item.track.name,
        artist: item.track.artists.map((a: any) => a.name).join(', '),
        album: item.track.album.name,
        thumbnail: item.track.album.images[0]?.url || '',
        duration: formatDuration(Math.floor(item.track.duration_ms / 1000)),
        previewUrl: item.track.preview_url,
        spotifyUrl: item.track.external_urls.spotify,
      }));
  } catch (error) {
    console.error('Trending music error:', error);
    throw error;
  }
}

// 추천 플레이리스트 가져오기 (유명 플레이리스트 ID 직접 사용)
export async function getFeaturedPlaylists(): Promise<Playlist[]> {
  try {
    // Spotify의 유명 플레이리스트 ID들
    const playlistIds = [
      '1ZiIGn61ZrbTkpNLJ27oYq', // Today's Top Hits Korea
      '6eqBL2l2SKQkLkPbRC3GdD', // RapCaviar
      '6Lftw5umRdQXZKXOLEzslQ', // mint
      '77PHLTDJEymzhZoqTlUeCJ', // Rock Classics
      '3Y2954J7rvKBavRsJvUkYT', // Are & Be
      '0DUV7ua5KYFjeCm9PdxCL8', // Hot Country
      '2GjntU7hrF6bUiZRDXjtmF', // New Music Friday Korea
      '4bGl1FHJUyPcdPVWJCOKaI', // Deep Focus
      '2gxSFvKsFPubXAZPgm8jGE', // Mood Booster
      '4zRrdC2uBzCCf6X7DXdmLU', // Chill Hits
    ];

    const playlists: Playlist[] = [];

    for (const id of playlistIds.slice(0, 8)) {
      try {
        const data = await spotifyFetch(`/playlists/${id}`);
        playlists.push({
          id: data.id,
          title: data.name,
          description: data.description || '',
          thumbnail: data.images[0]?.url || '',
          tracksCount: data.tracks.total,
          spotifyUrl: data.external_urls.spotify,
        });
      } catch (error) {
        console.warn(`Failed to fetch playlist ${id}:`, error);
      }
    }

    return playlists;
  } catch (error) {
    console.error('Featured playlists error:', error);
    throw error;
  }
}

// 플레이리스트 트랙 가져오기
export async function getPlaylistTracks(playlistId: string): Promise<Song[]> {
  try {
    const data = await spotifyFetch(`/playlists/${playlistId}/tracks?limit=50`);

    return data.items
      .filter((item: any) => item.track && !item.is_local)
      .map((item: any) => ({
        id: item.track.id,
        title: item.track.name,
        artist: item.track.artists.map((a: any) => a.name).join(', '),
        album: item.track.album.name,
        thumbnail: item.track.album.images[0]?.url || '',
        duration: formatDuration(Math.floor(item.track.duration_ms / 1000)),
        previewUrl: item.track.preview_url,
        spotifyUrl: item.track.external_urls.spotify,
      }));
  } catch (error) {
    console.error('Playlist tracks error:', error);
    throw error;
  }
}

// 초를 시간 형식으로 변환
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 미리듣기 재생 (30초)
export function playPreview(
  previewUrl: string | null
): HTMLAudioElement | null {
  if (!previewUrl) {
    console.warn('미리듣기 URL이 없습니다');
    return null;
  }

  const audio = new Audio(previewUrl);
  audio.play().catch((error) => {
    console.error('재생 실패:', error);
  });
  return audio;
}
