import MoodCard from './MoodCard';
import type { Mood } from '../../types/explore';

interface MoodSectionProps {
  moods: Mood[];
  onMoodClick?: (mood: Mood) => void;
}

export default function MoodSection({ moods, onMoodClick }: MoodSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">분위기 & 상황</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {moods.map((mood) => (
          <MoodCard
            key={mood.id}
            mood={mood}
            onClick={() => onMoodClick?.(mood)}
          />
        ))}
      </div>
    </section>
  );
}
