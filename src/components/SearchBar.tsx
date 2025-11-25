import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { searchMusic } from '../services';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchMusic(query);
      console.log('Search results:', results);
      onSearch?.(query);
      // TODO: 검색 결과 페이지로 이동
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 sm:mx-8">
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="노래, 앨범, 아티스트 검색"
          disabled={isSearching}
          className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-white text-gray-900 placeholder-gray-500 rounded-full py-2.5 pl-12 pr-4 outline-none transition-colors border border-transparent focus:border-gray-300 focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </form>
  );
}
