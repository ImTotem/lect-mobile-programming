export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  thumbnail: string;
  duration: string;
}

export interface Playlist {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
}

export interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}
