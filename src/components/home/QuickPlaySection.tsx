import QuickPlayCard from './QuickPlayCard';
import type { Song } from '../../types/music';

interface QuickPlaySectionProps {
  songs: Song[];
  onSongClick?: (song: Song) => void;
}

export default function QuickPlaySection({
  songs,
  onSongClick,
}: QuickPlaySectionProps) {
  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">빠른 재생</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {songs.map((song) => (
          <QuickPlayCard
            key={song.id}
            song={song}
            onClick={() => onSongClick?.(song)}
          />
        ))}
      </div>
    </section>
  );
}
