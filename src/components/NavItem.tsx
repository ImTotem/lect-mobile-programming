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
      className={`flex items-center gap-4 rounded-lg transition-colors relative ${
        active
          ? 'bg-red-50 text-red-500'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } ${isOpen ? 'px-4 py-3' : 'px-3 py-3 justify-center'}`}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      {isOpen && <span className="font-medium whitespace-nowrap">{label}</span>}
    </button>
  );
}
