import { GenreSection, MoodSection, TopChartsSection } from '../components/explore';
import { MOCK_GENRES, MOCK_MOODS, MOCK_CHARTS } from '../data';
import type { Genre, Mood, Chart } from '../types';

interface ExplorePageProps {
  isSidebarOpen: boolean;
}

export default function ExplorePage({ isSidebarOpen }: ExplorePageProps) {
  const handleGenreClick = (genre: Genre) => {
    console.log('Genre clicked:', genre);
    // TODO: 장르별 음악 목록 페이지로 이동
  };

  const handleMoodClick = (mood: Mood) => {
    console.log('Mood clicked:', mood);
    // TODO: 분위기별 플레이리스트 페이지로 이동
  };

  const handleChartClick = (chart: Chart) => {
    console.log('Chart clicked:', chart);
    // TODO: 차트 상세 페이지로 이동
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900 pt-16 pb-28 transition-all duration-300 ${
        isSidebarOpen ? 'pl-0 lg:pl-64 2xl:pl-20' : 'pl-0 lg:pl-20'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">탐색</h1>
          <p className="text-gray-600">새로운 음악을 발견해보세요</p>
        </div>

        <GenreSection genres={MOCK_GENRES} onGenreClick={handleGenreClick} />
        <MoodSection moods={MOCK_MOODS} onMoodClick={handleMoodClick} />
        <TopChartsSection charts={MOCK_CHARTS} onChartClick={handleChartClick} />
      </div>
    </div>
  );
}
