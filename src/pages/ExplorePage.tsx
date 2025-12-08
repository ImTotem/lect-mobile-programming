import { useState, useEffect } from 'react';
import { MoodSection, TopChartsSection } from '../components/explore';
import { PageLayout } from '../components';
import ExploreSkeleton from '../components/ExploreSkeleton';
import { getMoodCategories, getChartList } from '../services/ytmusic';
import { getCategoryStyle } from '../utils/exploreStyles';
import type { Mood, Chart } from '../types/explore';

interface ExplorePageProps {
  isSidebarOpen: boolean;
  onNavigate: (page: any) => void;
}

export default function ExplorePage({ isSidebarOpen, onNavigate }: ExplorePageProps) {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<{ title: string; items: any[] }[]>([]);
  const [charts, setCharts] = useState<Chart[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moodData, chartList] = await Promise.all([
          getMoodCategories(),
          getChartList()
        ]);

        // Filter for "Genre" sections only (case-insensitive "genre" or "장르")
        const genreSections = Object.entries(moodData)
          .filter(([title]) => {
            const lowerTitle = title.toLowerCase();
            return lowerTitle.includes('genre') || lowerTitle.includes('장르');
          })
          .map(([title, items]: [string, any], sectionIndex) => {
            const mappedItems = items.map((item: any, itemIndex: number) => {
              // Create a unique index for consistent random/fallback assignment
              const globalIndex = sectionIndex * 100 + itemIndex;
              const style = getCategoryStyle(item.title, globalIndex);

              return {
                id: globalIndex,
                name: item.title,
                color: style.color,
                params: item.params,
                thumbnail: style.image
              };
            });

            return {
              title,
              items: mappedItems
            };
          });

        setSections(genreSections);
        setCharts(chartList as Chart[]);

      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMoodClick = (mood: Mood) => {
    if (mood.params) {
      onNavigate({
        type: 'genre',
        params: mood.params,
        title: mood.name,
        color: mood.color
      });
    }
  };

  const handleChartClick = (chart: Chart) => {
    if (chart.playlistId) {
      onNavigate({
        type: 'playlist',
        playlistId: chart.playlistId,
        title: chart.title
      });
    }
  };

  return (
    <PageLayout isSidebarOpen={isSidebarOpen}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">탐색</h1>
        <p className="text-gray-600">다양한 장르의 음악을 발견해보세요</p>
      </div>

      {loading ? (
        <ExploreSkeleton />
      ) : (
        <div className="space-y-12">
          {/* Top Charts Section */}
          {charts.length > 0 && (
            <TopChartsSection charts={charts} onChartClick={handleChartClick} />
          )}

          {sections.map((section, index) => (
            <MoodSection
              key={section.title + index}
              title={section.title}
              moods={section.items}
              onMoodClick={handleMoodClick}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
