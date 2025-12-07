import SongListItem from './SongListItem';
import type { Song } from '../../types/music';

interface ChartSectionProps {
  songs: Song[];
  onSongClick?: (song: Song, songList: Song[]) => void;
}

export default function ChartSection({ songs, onSongClick }: ChartSectionProps) {
  return (
    <section>
      <h3 className="text-2xl font-bold mb-6 text-gray-900">인기 차트</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {songs.map((song, index) => (
            <SongListItem
              key={song.id}
              song={song}
              index={index}
              onClick={() => onSongClick?.(song, songs)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
