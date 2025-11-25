import type { Song, Playlist } from '../types/music';

// Spotify API 설정
const SPOTIFY_CLIENT_ID = '32f4f494ed9849a496a483f2f475b940';
const SPOTIFY_CLIENT_SECRET = '5591f2be7a7d4274b3792c735c778f28';

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
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // 1분 여유

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
    // /tracks 엔드포인트로 변경
    const data = await spotifyFetch(
      '/playlists/3tUdrnfVjOXbHFvD3sijQ2/tracks?limit=20'
    );

    // items 배열에서 track 정보 추출
    return data.items
      .filter((item: any) => item.track && !item.is_local) // track이 있고 로컬 파일이 아닌 것만
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

// 추천 플레이리스트 가져오기 (카테고리 기반으로 변경)
export async function getFeaturedPlaylists(): Promise<Playlist[]> {
  try {
    // 여러 카테고리에서 플레이리스트 가져오기
    const categories = ['toplists', 'kpop', 'pop', 'hiphop'];
    const allPlaylists: Playlist[] = [];

    for (const categoryId of categories) {
      try {
        const data = await spotifyFetch(
          `/browse/categories/${categoryId}/playlists?limit=3`
        );

        const playlists = data.playlists.items.map((playlist: any) => ({
          id: playlist.id,
          title: playlist.name,
          description: playlist.description || '',
          thumbnail: playlist.images[0]?.url || '',
          tracksCount: playlist.tracks.total,
          spotifyUrl: playlist.external_urls.spotify,
        }));

        allPlaylists.push(...playlists);
      } catch (error) {
        console.warn(`Failed to fetch ${categoryId} playlists:`, error);
      }
    }

    return allPlaylists.slice(0, 10); // 최대 10개
  } catch (error) {
    console.error('Featured playlists error:', error);
    throw error;
  }
}

// 플레이리스트 상세 정보 가져오기
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

// 새 앨범 가져오기
export async function getNewReleases(): Promise<Song[]> {
  try {
    const data = await spotifyFetch('/browse/new-releases?limit=20');

    return data.albums.items.flatMap(
      (album: any) =>
        album.tracks?.items?.slice(0, 1).map((track: any) => ({
          id: track.id || album.id,
          title: track.name || album.name,
          artist: album.artists.map((a: any) => a.name).join(', '),
          album: album.name,
          thumbnail: album.images[0]?.url || '',
          duration: track.duration_ms
            ? formatDuration(Math.floor(track.duration_ms / 1000))
            : '3:00',
          spotifyUrl: album.external_urls.spotify,
        })) || []
    );
  } catch (error) {
    console.error('New releases error:', error);
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
