import { FiHome, FiMusic, FiHeart, FiClock } from 'react-icons/fi';

export default function Footer() {
  const navItems = [
    { icon: FiHome, label: '홈', active: true },
    { icon: FiMusic, label: '탐색', active: false },
    { icon: FiHeart, label: '보관함', active: false },
    { icon: FiClock, label: '최근 재생', active: false },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 z-40 w-20 lg:w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-red-50 text-red-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium hidden lg:block">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
