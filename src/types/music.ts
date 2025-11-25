export interface Song {
  id: number | string;
  title: string;
  artist: string;
  album: string;
  thumbnail: string;
  duration: string;
  previewUrl?: string; // Spotify 미리듣기 URL
  spotifyUrl?: string; // Spotify 링크
}

export interface Playlist {
  id: number | string;
  title: string;
  description: string;
  thumbnail: string;
  tracksCount?: number;
  spotifyUrl?: string;
}

export interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}
