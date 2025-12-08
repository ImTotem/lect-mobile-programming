import { FiPlay } from 'react-icons/fi';
import type { Song } from '../../types/music';

interface QuickPlayCardProps {
  song: Song;
  onClick?: () => void;
}

export default function QuickPlayCard({ song, onClick }: QuickPlayCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 bg-white hover:bg-gray-50 rounded-lg p-3 transition-all hover:scale-[1.02] shadow-sm hover:shadow-md border border-gray-200"
    >
      <img
        src={song.thumbnail}
        alt={song.title}
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.includes('mqdefault') && !target.src.includes('default')) {
            target.src = `https://i.ytimg.com/vi/${song.id}/mqdefault.jpg`;
          } else if (target.src.includes('mqdefault')) {
            target.src = `https://i.ytimg.com/vi/${song.id}/default.jpg`;
          }
        }}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1 text-left">
        <h4 className="font-semibold text-gray-900 line-clamp-1">
          {song.title}
        </h4>
        <p className="text-sm text-gray-600 line-clamp-1">{song.artist}</p>
      </div>
      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        <FiPlay className="text-white w-5 h-5 ml-0.5" />
      </div>
    </button>
  );
}
