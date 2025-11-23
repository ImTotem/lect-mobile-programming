import { FiSearch, FiUser, FiMenu } from 'react-icons/fi';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Menu Button & Logo */}
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

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="노래, 앨범, 아티스트 검색"
                className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-white text-gray-900 placeholder-gray-500 rounded-full py-2.5 pl-12 pr-4 outline-none transition-colors border border-transparent focus:border-gray-300 focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          {/* User Icon */}
          <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
            <FiUser className="text-gray-700 w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
