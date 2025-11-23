import { FiPlay } from 'react-icons/fi';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  thumbnail: string;
  duration: string;
}

// 임시 데이터
const MOCK_SONGS: Song[] = [
  {
    id: 1,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    thumbnail: 'https://picsum.photos/seed/1/400/400',
    duration: '3:20',
  },
  {
    id: 2,
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    thumbnail: 'https://picsum.photos/seed/2/400/400',
    duration: '3:23',
  },
  {
    id: 3,
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    thumbnail: 'https://picsum.photos/seed/3/400/400',
    duration: '3:35',
  },
  {
    id: 4,
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    thumbnail: 'https://picsum.photos/seed/4/400/400',
    duration: '2:58',
  },
  {
    id: 5,
    title: 'Peaches',
    artist: 'Justin Bieber',
    album: 'Justice',
    thumbnail: 'https://picsum.photos/seed/5/400/400',
    duration: '3:18',
  },
  {
    id: 6,
    title: 'Stay',
    artist: 'The Kid LAROI, Justin Bieber',
    album: 'F*CK LOVE 3',
    thumbnail: 'https://picsum.photos/seed/6/400/400',
    duration: '2:21',
  },
];

const MOCK_PLAYLISTS = [
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900 pt-16 pb-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 p-8 flex items-end shadow-xl">
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold mb-2 text-white">
                음악의 모든 것
              </h2>
              <p className="text-lg text-white/90">
                무제한으로 즐기는 음악 스트리밍
              </p>
            </div>
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </section>

        {/* Quick Play Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">빠른 재생</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_SONGS.slice(0, 6).map((song) => (
              <button
                key={song.id}
                className="group flex items-center gap-4 bg-white hover:bg-gray-50 rounded-lg p-3 transition-all hover:scale-[1.02] shadow-sm hover:shadow-md border border-gray-200"
              >
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-gray-900 line-clamp-1">
                    {song.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {song.artist}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <FiPlay className="text-white w-5 h-5 ml-0.5" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Recommended Playlists */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">추천 플레이리스트</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {MOCK_PLAYLISTS.map((playlist) => (
              <div
                key={playlist.id}
                className="group cursor-pointer"
              >
                <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100 aspect-square shadow-md hover:shadow-xl transition-shadow">
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-xl">
                      <FiPlay className="text-white w-6 h-6 ml-1" />
                    </div>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {playlist.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {playlist.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Songs */}
        <section>
          <h3 className="text-2xl font-bold mb-6 text-gray-900">인기 차트</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {MOCK_SONGS.map((song, index) => (
                <div
                  key={song.id}
                  className="group flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span className="text-gray-500 font-semibold w-6 text-center">
                    {index + 1}
                  </span>
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-14 h-14 rounded-lg object-cover shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 line-clamp-1">
                      {song.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {song.artist}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 hidden sm:block">
                    {song.album}
                  </span>
                  <span className="text-sm text-gray-500">{song.duration}</span>
                  <button className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                    <FiPlay className="text-white w-5 h-5 ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
