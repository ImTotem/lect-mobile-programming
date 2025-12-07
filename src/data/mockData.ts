import type { Song, Playlist } from '../types/music';

export const MOCK_SONGS: Song[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    thumbnail: 'https://picsum.photos/seed/1/400/400',
    duration: '3:20',
  },
  {
    id: '2',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    thumbnail: 'https://picsum.photos/seed/2/400/400',
    duration: '3:23',
  },
  {
    id: '3',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    thumbnail: 'https://picsum.photos/seed/3/400/400',
    duration: '3:35',
  },
  {
    id: '4',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    thumbnail: 'https://picsum.photos/seed/4/400/400',
    duration: '2:58',
  },
  {
    id: '5',
    title: 'Peaches',
    artist: 'Justin Bieber',
    album: 'Justice',
    thumbnail: 'https://picsum.photos/seed/5/400/400',
    duration: '3:18',
  },
  {
    id: '6',
    title: 'Stay',
    artist: 'The Kid LAROI, Justin Bieber',
    album: 'F*CK LOVE 3',
    thumbnail: 'https://picsum.photos/seed/6/400/400',
    duration: '2:21',
  },
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 1,
    title: '오늘의 믹스',
    description: '당신을 위한 맞춤 플레이리스트',
    thumbnail: 'https://picsum.photos/seed/p1/400/400',
  },
  {
    id: 2,
    title: '인기 급상승',
    description: '지금 가장 핫한 음악',
    thumbnail: 'https://picsum.photos/seed/p2/400/400',
  },
  {
    id: 3,
    title: 'K-POP 히트곡',
    description: '최신 K-POP 트렌드',
    thumbnail: 'https://picsum.photos/seed/p3/400/400',
  },
  {
    id: 4,
    title: '팝 명곡',
    description: '시대를 초월한 팝 음악',
    thumbnail: 'https://picsum.photos/seed/p4/400/400',
  },
];
