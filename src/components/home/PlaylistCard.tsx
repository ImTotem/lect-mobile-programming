import { FiPlay } from 'react-icons/fi';
import type { Playlist } from '../../types/music';

interface PlaylistCardProps {
  playlist: Playlist;
  onClick?: () => void;
}

export default function PlaylistCard({ playlist, onClick }: PlaylistCardProps) {
  return (
    <div onClick={onClick} className="group">
      <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100 aspect-square shadow-md hover:shadow-xl transition-shadow">
        <img
          src={playlist.thumbnail}
          alt={playlist.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-xl">
            <FiPlay className="text-white w-6 h-6 ml-1" />
          </div>
        </div>
      </div>
      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
        {playlist.title}
      </h4>
      <p className="text-sm text-gray-600 line-clamp-2">
        {playlist.description}
      </p>
    </div>
  );
}
