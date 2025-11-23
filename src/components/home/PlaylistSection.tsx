import PlaylistCard from './PlaylistCard';
import type { Playlist } from '../../types/music';

interface PlaylistSectionProps {
  playlists: Playlist[];
  onPlaylistClick?: (playlist: Playlist) => void;
}

export default function PlaylistSection({
  playlists,
  onPlaylistClick,
}: PlaylistSectionProps) {
  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">
        추천 플레이리스트
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onClick={() => onPlaylistClick?.(playlist)}
          />
        ))}
      </div>
    </section>
  );
}
