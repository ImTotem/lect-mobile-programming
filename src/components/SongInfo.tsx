import { FiHeart } from 'react-icons/fi';

interface SongInfoProps {
  id?: string;
  title: string;
  artist: string;
  thumbnail: string;
  isLiked?: boolean;
  onToggleLike?: () => void;
}

export default function SongInfo({
  id,
  title,
  artist,
  thumbnail,
  isLiked = false,
  onToggleLike,
}: SongInfoProps) {
  return (
    <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xs">
      <img
        src={thumbnail}
        alt={title}
        className="w-12 h-12 rounded-md object-cover shadow-sm flex-shrink-0"
        onError={(e) => {
          if (!id) return;
          const target = e.currentTarget;
          if (target.src.includes('lh3.googleusercontent.com')) {
            if (!target.src.includes('=w60-h60')) {
              target.src = target.src.replace(/=w\d+-h\d+/, '=w60-h60');
              return;
            }
          }
          target.style.display = 'none';
        }}
      />
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
          {title}
        </h4>
        <p className="text-xs text-gray-600 line-clamp-1">{artist}</p>
      </div>
      {onToggleLike && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike();
          }}
          className={`p-2 rounded-full transition-colors ${isLiked ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
            }`}
        >
          <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      )}
    </div>
  );
}
