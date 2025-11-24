import type { Genre } from '../../types/explore';

interface GenreCardProps {
  genre: Genre;
  onClick?: () => void;
}

export default function GenreCard({ genre, onClick }: GenreCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative h-32 rounded-lg overflow-hidden bg-gradient-to-br ${genre.color} hover:scale-105 transition-transform shadow-md hover:shadow-xl`}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 p-4 h-full flex items-end">
        <h3 className="text-white text-xl font-bold">{genre.name}</h3>
      </div>
    </button>
  );
}
