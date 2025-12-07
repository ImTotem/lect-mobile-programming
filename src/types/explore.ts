export interface Genre {
  id: number;
  name: string;
  thumbnail?: string; // made optional
  color: string;
  params?: string; // added for navigation
}

export interface Mood {
  id: number;
  name: string;
  description?: string; // made optional
  thumbnail?: string; // made optional for API compatibility
  color?: string; // added for fallback UI
  params?: string; // added for navigation
}

export interface Chart {
  id: number;
  title: string;
  country: string;
  thumbnail: string;
  songs: number;
  playlistId?: string; // added for navigation
  params?: string; // added for navigation
}
