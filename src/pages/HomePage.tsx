import { useEffect, useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import QuickPlaySection from '../components/home/QuickPlaySection';
import PlaylistSection from '../components/home/PlaylistSection';
import ChartSection from '../components/home/ChartSection';
import { getTrendingMusic, getFeaturedPlaylists } from '../services';
import { usePlayer } from '../contexts';
import type { Song, Playlist } from '../types/music';

interface HomePageProps {
  isSidebarOpen: boolean;
}

export default function HomePage({ isSidebarOpen }: HomePageProps) {
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playQueue } = usePlayer();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [songs, featuredPlaylists] = await Promise.all([
          getTrendingMusic(),
          getFeaturedPlaylists(),
        ]);
        setTrendingSongs(songs);
        setPlaylists(featuredPlaylists);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSongClick = (song: Song, songList: Song[]) => {
    // 클릭한 곡의 인덱스 찾기
    const index = songList.findIndex((s) => s.id === song.id);
    // 전체 리스트를 큐에 추가하고 클릭한 곡부터 재생
    playQueue(songList, index >= 0 ? index : 0);
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    console.log('Playlist clicked:', playlist);
    // TODO: 플레이리스트 상세 페이지로 이동
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900 pt-16 pb-28 transition-all duration-300 ${isSidebarOpen ? 'pl-0 lg:pl-64 2xl:pl-20' : 'pl-0 lg:pl-20'
          }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">음악을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900 pt-16 pb-28 transition-all duration-300 ${isSidebarOpen ? 'pl-0 lg:pl-64 2xl:pl-20' : 'pl-0 lg:pl-20'
        }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection
          title="음악의 모든 것"
          subtitle="무제한으로 즐기는 음악 스트리밍"
        />

        <QuickPlaySection
          songs={trendingSongs.slice(0, 6)}
          onSongClick={handleSongClick}
        />

        <PlaylistSection
          playlists={playlists}
          onPlaylistClick={handlePlaylistClick}
        />

        <ChartSection songs={trendingSongs} onSongClick={handleSongClick} />
      </div>
    </div>
  );
}
