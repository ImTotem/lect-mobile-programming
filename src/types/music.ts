export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId?: string; // YouTube Music video ID
  lyricsBrowseId?: string; // Lyrics browse ID for fetching lyrics
}

export interface LyricLine {
  text: string;
  startTime: number | null; // in milliseconds
  endTime: number | null; // in milliseconds
  id: number | null;
}

export interface Playlist {
  id: string | number;
  title: string;
  description: string;
  thumbnail: string;
  tracksCount?: number;
}

export interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}
