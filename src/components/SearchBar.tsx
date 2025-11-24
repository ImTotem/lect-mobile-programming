import { FiSearch } from 'react-icons/fi';

export default function SearchBar() {
  return (
    <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="노래, 앨범, 아티스트 검색"
          className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-white text-gray-900 placeholder-gray-500 rounded-full py-2.5 pl-12 pr-4 outline-none transition-colors border border-transparent focus:border-gray-300 focus:ring-2 focus:ring-red-500/20"
        />
      </div>
    </div>
  );
}
