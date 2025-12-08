import { useState, useRef, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';

interface UserButtonProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onNavigate?: (page: string) => void;
}

export default function UserButton({ user }: UserButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors overflow-hidden border border-transparent focus:border-red-200"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <FiUser className="text-gray-700 w-5 h-5" />
        )}
      </button>

      {/* Dropdown Menu (Empty for now as profile is removed) */}
      {isMenuOpen && (
        <div className="absolute right-0 top-11 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-up origin-top-right">
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            로그인 기능이 없습니다.
          </div>
        </div>
      )}
    </div>
  );
}
