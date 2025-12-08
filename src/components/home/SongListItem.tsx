import { FiPlay } from 'react-icons/fi';
import type { Song } from '../../types/music';

interface SongListItemProps {
  song: Song;
  index: number;
  onClick?: () => void;
}

export default function SongListItem({
  song,
  index,
  onClick,
}: SongListItemProps) {
  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
    >
      <span className="text-gray-500 font-semibold w-6 text-center">
        {index + 1}
      </span>
      <img
        src={song.thumbnail}
        alt={song.title}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src.includes('lh3.googleusercontent.com')) {
            if (!target.src.includes('=w60-h60')) {
              target.src = target.src.replace(/=w\d+-h\d+/, '=w60-h60');
              return;
            }
          }
          target.style.display = 'none';
        }}
        className="w-14 h-14 rounded-lg object-cover shadow-sm"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 line-clamp-1">
          {song.title}
        </h4>
        <p className="text-sm text-gray-600 line-clamp-1">{song.artist}</p>
      </div>
      <span className="text-sm text-gray-500 hidden sm:block">
        {song.album}
      </span>
      <span className="text-sm text-gray-500">{song.duration}</span>
      <button className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg">
        <FiPlay className="text-white w-5 h-5 ml-0.5" />
      </button>
    </div>
  );
}
