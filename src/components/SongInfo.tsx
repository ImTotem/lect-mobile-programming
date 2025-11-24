import { FiHeart } from 'react-icons/fi';

interface SongInfoProps {
  title: string;
  artist: string;
  thumbnail: string;
  isLiked: boolean;
  onLikeToggle: () => void;
}

export default function SongInfo({
  title,
  artist,
  thumbnail,
  isLiked,
  onLikeToggle,
}: SongInfoProps) {
  return (
    <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xs">
      <img
        src={thumbnail}
        alt={title}
        className="w-12 h-12 rounded-md object-cover shadow-sm flex-shrink-0"
      />
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
          {title}
        </h4>
        <p className="text-xs text-gray-600 line-clamp-1">{artist}</p>
      </div>
      <button
        onClick={onLikeToggle}
        className="hidden sm:block flex-shrink-0"
      >
        <FiHeart
          className={`w-5 h-5 transition-colors ${
            isLiked
              ? 'fill-red-500 text-red-500'
              : 'text-gray-600 hover:text-red-500'
          }`}
        />
      </button>
    </div>
  );
}
