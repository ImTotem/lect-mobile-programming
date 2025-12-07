import { GenreSection, MoodSection, TopChartsSection } from '../components/explore';
import { PageLayout } from '../components';
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
    <PageLayout isSidebarOpen={isSidebarOpen}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">탐색</h1>
        <p className="text-gray-600">새로운 음악을 발견해보세요</p>
      </div>

      <GenreSection genres={MOCK_GENRES} onGenreClick={handleGenreClick} />
      <MoodSection moods={MOCK_MOODS} onMoodClick={handleMoodClick} />
      <TopChartsSection charts={MOCK_CHARTS} onChartClick={handleChartClick} />
    </PageLayout>
  );
}
