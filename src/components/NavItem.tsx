import { type IconType } from 'react-icons';

interface NavItemProps {
  icon: IconType;
  label: string;
  active: boolean;
  isOpen: boolean;
  onClick?: () => void;
}

export default function NavItem({
  icon: Icon,
  label,
  active,
  isOpen,
  onClick,
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center rounded-lg transition-colors relative px-3 py-3 ${active
        ? 'bg-red-50 text-red-500'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen
            ? 'grid-cols-[1fr] opacity-100 ml-4'
            : 'grid-cols-[0fr] opacity-0 ml-0'
          }`}
      >
        <span className="font-medium whitespace-nowrap overflow-hidden">
          {label}
        </span>
      </div>
    </button>
  );
}
