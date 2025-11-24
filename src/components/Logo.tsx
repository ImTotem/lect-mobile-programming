import { FiMenu } from 'react-icons/fi';

interface LogoProps {
  onMenuClick: () => void;
}

export default function Logo({ onMenuClick }: LogoProps) {
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
      >
        <FiMenu className="text-gray-700 w-5 h-5" />
      </button>
      <button
        onClick={handleLogoClick}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <img
          src="https://music.youtube.com/img/favicon_144.png"
          alt="YouTube Music"
          className="h-8 w-8"
        />
        <h1 className="text-gray-900 text-xl font-medium hidden sm:block">
          YouTube Music
        </h1>
      </button>
    </div>
  );
}
