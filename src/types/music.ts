export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  videoId?: string; // YouTube Music video ID
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  trackCount: number;
}

export interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}
