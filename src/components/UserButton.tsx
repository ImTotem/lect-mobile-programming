import { FiUser } from 'react-icons/fi';

export default function UserButton() {
  return (
    <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
      <FiUser className="text-gray-700 w-5 h-5" />
    </button>
  );
}
