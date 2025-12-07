import { useState } from 'react';
import type { Mood } from '../../types/explore';

interface MoodCardProps {
  mood: Mood;
  onClick?: () => void;
}

export default function MoodCard({ mood, onClick }: MoodCardProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = mood.thumbnail && !imageError;

  return (
    <button
      onClick={onClick}
      className="group relative rounded-lg overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition-all text-left"
    >
      <div className={`aspect-square ${!showImage ? `bg-gradient-to-br ${mood.color || 'from-gray-400 to-gray-600'}` : ''}`}>
        {showImage ? (
          <img
            src={mood.thumbnail}
            alt={mood.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <span className="text-white text-2xl font-bold opacity-50">{mood.name[0]}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{mood.name}</h3>
        {mood.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{mood.description}</p>
        )}
      </div>
    </button>
  );
}
