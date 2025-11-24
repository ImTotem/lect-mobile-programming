import type { Mood } from '../../types/explore';

interface MoodCardProps {
  mood: Mood;
  onClick?: () => void;
}

export default function MoodCard({ mood, onClick }: MoodCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-lg overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition-all"
    >
      <div className="aspect-square">
        <img
          src={mood.thumbnail}
          alt={mood.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{mood.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{mood.description}</p>
      </div>
    </button>
  );
}
