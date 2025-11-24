import type { Genre, Mood, Chart } from '../types/explore';

export const MOCK_GENRES: Genre[] = [
  {
    id: 1,
    name: 'K-POP',
    thumbnail: 'https://picsum.photos/seed/genre1/400/400',
    color: 'from-pink-500 to-purple-500',
  },
  {
    id: 2,
    name: 'POP',
    thumbnail: 'https://picsum.photos/seed/genre2/400/400',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3,
    name: 'Hip Hop',
    thumbnail: 'https://picsum.photos/seed/genre3/400/400',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 4,
    name: 'R&B',
    thumbnail: 'https://picsum.photos/seed/genre4/400/400',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 5,
    name: 'Rock',
    thumbnail: 'https://picsum.photos/seed/genre5/400/400',
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 6,
    name: 'Jazz',
    thumbnail: 'https://picsum.photos/seed/genre6/400/400',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 7,
    name: 'Classical',
    thumbnail: 'https://picsum.photos/seed/genre7/400/400',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 8,
    name: 'Electronic',
    thumbnail: 'https://picsum.photos/seed/genre8/400/400',
    color: 'from-green-500 to-teal-500',
  },
];

export const MOCK_MOODS: Mood[] = [
  {
    id: 1,
    name: '운동',
    description: '에너지 넘치는 운동 음악',
    thumbnail: 'https://picsum.photos/seed/mood1/400/400',
  },
  {
    id: 2,
    name: '집중',
    description: '공부하거나 일할 때',
    thumbnail: 'https://picsum.photos/seed/mood2/400/400',
  },
  {
    id: 3,
    name: '휴식',
    description: '편안한 휴식 시간',
    thumbnail: 'https://picsum.photos/seed/mood3/400/400',
  },
  {
    id: 4,
    name: '파티',
    description: '신나는 파티 음악',
    thumbnail: 'https://picsum.photos/seed/mood4/400/400',
  },
  {
    id: 5,
    name: '수면',
    description: '숙면을 위한 음악',
    thumbnail: 'https://picsum.photos/seed/mood5/400/400',
  },
  {
    id: 6,
    name: '드라이브',
    description: '드라이브하기 좋은 음악',
    thumbnail: 'https://picsum.photos/seed/mood6/400/400',
  },
];

export const MOCK_CHARTS: Chart[] = [
  {
    id: 1,
    title: '글로벌 TOP 100',
    country: 'Global',
    thumbnail: 'https://picsum.photos/seed/chart1/400/400',
    songs: 100,
  },
  {
    id: 2,
    title: '한국 TOP 50',
    country: 'Korea',
    thumbnail: 'https://picsum.photos/seed/chart2/400/400',
    songs: 50,
  },
  {
    id: 3,
    title: '미국 TOP 100',
    country: 'USA',
    thumbnail: 'https://picsum.photos/seed/chart3/400/400',
    songs: 100,
  },
  {
    id: 4,
    title: '일본 TOP 50',
    country: 'Japan',
    thumbnail: 'https://picsum.photos/seed/chart4/400/400',
    songs: 50,
  },
];
