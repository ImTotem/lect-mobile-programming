import type { Song, Playlist } from '../types/music';

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiry: number = 0;
let tokenPromise: Promise<string> | null = null;

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  if (tokenPromise) {
    return tokenPromise;
  }

  tokenPromise = (async () => {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) throw new Error('토큰 발급 실패');

      const data = await response.json();
      accessToken = data.access_token;
      tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
      
      return data.access_token as string;
    } finally {
      tokenPromise = null;
    }
  })();

  return tokenPromise;
}

async function spotifyFetch(endpoint: string): Promise<any> {
  const token = await getAccessToken();
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function searchMusic(query: string): Promise<Song[]> {
  const data = await spotifyFetch(`/search?q=${encodeURIComponent(query)}&type=track&limit=20`);
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
}

export async function getTrendingMusic(): Promise<Song[]> {
  const data = await spotifyFetch('/playlists/3tUdrnfVjOXbHFvD3sijQ2/tracks?limit=20');
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
}

export async function getFeaturedPlaylists(): Promise<Playlist[]> {
  const playlistIds = [
    '1ZiIGn61ZrbTkpNLJ27oYq',
    '6Lftw5umRdQXZKXOLEzslQ',
    '77PHLTDJEymzhZoqTlUeCJ',
    '0DUV7ua5KYFjeCm9PdxCL8',
  ];

  const results = await Promise.all(
    playlistIds.map(async (id) => {
      try {
        const data = await spotifyFetch(`/playlists/${id}?fields=id,name,description,images,tracks.total,external_urls`);
        return {
          id: data.id,
          title: data.name,
          description: data.description || '',
          thumbnail: data.images[0]?.url || '',
          tracksCount: data.tracks.total,
          spotifyUrl: data.external_urls.spotify,
        } as Playlist;
      } catch {
        return null;
      }
    })
  );

  return results.filter((p): p is Playlist => p !== null);
}

export async function getPlaylistTracks(playlistId: string): Promise<Song[]> {
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
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function playPreview(previewUrl: string | null): HTMLAudioElement | null {
  if (!previewUrl) return null;
  const audio = new Audio(previewUrl);
  audio.play();
  return audio;
}
