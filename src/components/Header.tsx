import Logo from './Logo';
import SearchBar from './SearchBar';

interface HeaderProps {
  onMenuClick: () => void;
  onNavigate?: (page: any) => void;
  onLogoClick: () => void;
}

export default function Header({ onMenuClick, onLogoClick, onNavigate }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 transition-all duration-300 pl-0 lg:pl-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Logo onMenuClick={onMenuClick} onLogoClick={onLogoClick} />
          <div className="flex-1 flex justify-center">
            <SearchBar onSearch={(query) => onNavigate?.({ type: 'search', query })} />
          </div>
          <div className="w-20 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
