import Logo from './Logo';
import SearchBar from './SearchBar';
import UserButton from './UserButton';

interface HeaderProps {
  onMenuClick: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function Header({ onMenuClick, user }: HeaderProps) {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // TODO: 검색 결과 페이지로 이동
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo onMenuClick={onMenuClick} />
          <SearchBar onSearch={handleSearch} />
          <UserButton user={user} />
        </div>
      </div>
    </header>
  );
}
