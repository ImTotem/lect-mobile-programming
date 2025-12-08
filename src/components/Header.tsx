import Logo from './Logo';
import SearchBar from './SearchBar';
import UserButton from './UserButton';

interface HeaderProps {
  onMenuClick: () => void;
  onLogoClick?: () => void;
  onNavigate: (page: any) => void;
  isSidebarOpen: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function Header({ onMenuClick, onLogoClick, onNavigate, isSidebarOpen, user }: HeaderProps) {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    onNavigate({ type: 'search', query });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'pl-0 lg:pl-64' : 'pl-0 lg:pl-20'}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo onMenuClick={onMenuClick} onLogoClick={onLogoClick} />
          <SearchBar onSearch={handleSearch} />
          <UserButton user={user} />
        </div>
      </div>
    </header>
  );
}
