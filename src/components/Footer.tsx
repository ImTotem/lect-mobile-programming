import { FiHome, FiMusic, FiHeart, FiClock } from 'react-icons/fi';

export default function Footer() {
  const navItems = [
    { icon: FiHome, label: '홈', active: true },
    { icon: FiMusic, label: '탐색', active: false },
    { icon: FiHeart, label: '보관함', active: false },
    { icon: FiClock, label: '최근 재생', active: false },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4">
        <nav className="flex items-center justify-around h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  item.active
                    ? 'text-red-500'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
