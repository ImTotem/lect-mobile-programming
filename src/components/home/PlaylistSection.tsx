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
      <div className="relative overflow-clip">
        {/* Fade effect on the right to indicate more content */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 via-gray-50/60 to-transparent pointer-events-none z-10" />

        <div className="overflow-x-auto overflow-y-visible scrollbar-hide pb-4 -mb-4">
          <div className="flex gap-4 sm:gap-6">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="flex-shrink-0 w-48 sm:w-56 first:ml-0 last:mr-20">
                <PlaylistCard
                  playlist={playlist}
                  onClick={() => onPlaylistClick?.(playlist)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
