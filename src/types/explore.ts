export interface Genre {
  id: number;
  name: string;
  thumbnail: string;
  color: string;
}

export interface Mood {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
}

export interface Chart {
  id: number;
  title: string;
  country: string;
  thumbnail: string;
  songs: number;
}
