import GenreCard from './GenreCard';
import type { Genre } from '../../types/explore';

interface GenreSectionProps {
  genres: Genre[];
  onGenreClick?: (genre: Genre) => void;
}

export default function GenreSection({ genres, onGenreClick }: GenreSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">장르별 탐색</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <GenreCard
            key={genre.id}
            genre={genre}
            onClick={() => onGenreClick?.(genre)}
          />
        ))}
      </div>
    </section>
  );
}
