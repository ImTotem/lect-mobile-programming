import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { getSearchSuggestions } from '../services';
import { useDebounce } from '../hooks';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length > 0) {
        setIsSearching(true);
        try {
          const results = await getSearchSuggestions(debouncedQuery);
          setSuggestions(results);
          setShowSuggestions(true);
          setSelectedIndex(-1); // Reset selection on new results
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global '/' key shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearching) {
        const activeEl = document.activeElement;
        const isInput = activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement || (activeEl as HTMLElement).isContentEditable;

        if (!isInput) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSearching]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex !== -1 && suggestions[selectedIndex]) {
      performSearch(suggestions[selectedIndex]);
      return;
    }
    if (!query.trim()) return;
    performSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    // 한글 입력 중 조합 상태일 때는 이벤트 무시 (Enter 중복 방지)
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const performSearch = (text: string) => {
    setQuery(text);
    setShowSuggestions(false);
    onSearch?.(text);
  };

  return (
    <div ref={searchRef} className="flex-1 max-w-4xl mx-4 sm:mx-8 relative">
      <form onSubmit={handleSearch} className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 0) setShowSuggestions(true);
          }}
          onFocus={() => {
            if (query.length > 0) setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="노래, 앨범, 아티스트 검색"
          className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-white text-gray-900 placeholder-gray-500 rounded-full py-2.5 pl-12 pr-4 outline-none transition-all border border-transparent focus:border-gray-200 focus:shadow-lg"
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
          </div>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden">
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  onClick={() => performSearch(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                >
                  <FiSearch className={`w-4 h-4 ${index === selectedIndex ? 'text-gray-900' : 'text-gray-400'}`} />
                  <span className="text-gray-900 font-medium" dangerouslySetInnerHTML={{
                    __html: suggestion.replace(new RegExp(`(${query})`, 'gi'), '<span class="text-black font-bold">$1</span>')
                  }} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
