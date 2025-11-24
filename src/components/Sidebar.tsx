import { FiHome, FiMusic, FiHeart, FiClock, FiX } from 'react-icons/fi';
import { useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navItems = [
    { icon: FiHome, label: '홈', active: true },
    { icon: FiMusic, label: '탐색', active: false },
    { icon: FiHeart, label: '보관함', active: false },
    { icon: FiClock, label: '최근 재생', active: false },
  ];

  // 모바일에서 사이드바 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay (모바일에서만) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-20 z-40 bg-white/95 backdrop-blur-sm border-r border-gray-200 transition-all duration-300 overflow-hidden ${
          // 모바일: 열림/닫힘, 데스크톱: 확장/축소
          isOpen
            ? 'w-64 translate-x-0'
            : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'
        }`}
      >
        <div className={`flex flex-col h-full ${isOpen ? 'w-64' : 'w-20'}`}>
          {/* Close Button (모바일에서만) */}
          {isOpen && (
            <div className="flex justify-end p-4 lg:hidden">
              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <FiX className="text-gray-700 w-5 h-5" />
              </button>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`flex items-center gap-4 rounded-lg transition-colors relative ${
                    item.active
                      ? 'bg-red-50 text-red-500'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  } ${isOpen ? 'px-4 py-3' : 'px-3 py-3 justify-center'}`}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  {isOpen && (
                    <span className="font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
