import HeroSection from '../components/home/HeroSection';
import QuickPlaySection from '../components/home/QuickPlaySection';
import PlaylistSection from '../components/home/PlaylistSection';
import ChartSection from '../components/home/ChartSection';
import { MOCK_SONGS, MOCK_PLAYLISTS } from '../data/mockData';
import type { Song, Playlist } from '../types/music';

interface HomePageProps {
  isSidebarOpen: boolean;
}

export default function HomePage({ isSidebarOpen }: HomePageProps) {
  const handleSongClick = (song: Song) => {
    console.log('Song clicked:', song);
    // TODO: 음악 재생 로직 구현
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    console.log('Playlist clicked:', playlist);
    // TODO: 플레이리스트 상세 페이지로 이동
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900 pt-16 pb-28 transition-all duration-300 ${
        isSidebarOpen ? 'pl-0 lg:pl-64 2xl:pl-20' : 'pl-0 lg:pl-20'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection
          title="음악의 모든 것"
          subtitle="무제한으로 즐기는 음악 스트리밍"
        />

        <QuickPlaySection
          songs={MOCK_SONGS.slice(0, 6)}
          onSongClick={handleSongClick}
        />

        <PlaylistSection
          playlists={MOCK_PLAYLISTS}
          onPlaylistClick={handlePlaylistClick}
        />

        <ChartSection songs={MOCK_SONGS} onSongClick={handleSongClick} />
      </div>
    </div>
  );
}
