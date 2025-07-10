import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Input from './Input';

const SearchInterface = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const mockSuggestions = [
    { type: 'recent', text: 'mumbai local news', category: 'Mumbai' },
    { type: 'recent', text: 'politics latest updates', category: 'Politics' },
    { type: 'trending', text: 'national news headlines', category: 'National News' },
    { type: 'trending', text: 'international news today', category: 'International News' },
    { type: 'suggestion', text: 'mumbai monsoon updates', category: 'Mumbai' },
    { type: 'suggestion', text: 'election results', category: 'Politics' },
    { type: 'suggestion', text: 'parliament session highlights', category: 'National News' },
    { type: 'suggestion', text: 'global summit', category: 'International News' },
  ];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (value.length > 0) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const filtered = mockSuggestions.filter(item =>
          item.text.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 6));
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
    if (query.length === 0) {
      setSuggestions(mockSuggestions.slice(0, 4));
    }
  };

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsExpanded(false);
      setQuery('');
      setSuggestions([]);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion.text);
  };

  const handleKeyDown = (e) => {
    if (!isExpanded || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsExpanded(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'recent':
        return 'Clock';
      case 'trending':
        return 'TrendingUp';
      default:
        return 'Search';
    }
  };

  const getSuggestionLabel = (type) => {
    switch (type) {
      case 'recent':
        return 'Recent';
      case 'trending':
        return 'Trending';
      default:
        return 'Suggested';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search news..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon 
            name="Search" 
            size={16} 
            className="text-text-secondary"
          />
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-primary transition-colors duration-200"
            aria-label="Clear search"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-news-lg z-dropdown max-h-80 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          {isLoading ? (
            <div className="p-4 flex items-center justify-center">
              <div className="flex items-center space-x-2 text-text-secondary">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Searching...</span>
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {query.length === 0 && (
                <div className="px-4 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  Quick Access
                </div>
              )}
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.text}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-surface transition-colors duration-200 ${
                    selectedIndex === index ? 'bg-surface' : ''
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <Icon 
                    name={getSuggestionIcon(suggestion.type)} 
                    size={16} 
                    className="text-text-secondary flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-primary truncate">
                      {suggestion.text}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-text-secondary">
                        {getSuggestionLabel(suggestion.type)}
                      </span>
                      <span className="text-xs text-text-secondary">•</span>
                      <span className="text-xs text-accent">
                        {suggestion.category}
                      </span>
                    </div>
                  </div>
                  <Icon 
                    name="ArrowUpRight" 
                    size={14} 
                    className="text-text-secondary flex-shrink-0"
                  />
                </button>
              ))}
              
              {query && (
                <div className="border-t border-border mt-2 pt-2">
                  <button
                    onClick={() => handleSearch()}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-surface transition-colors duration-200"
                  >
                    <Icon name="Search" size={16} className="text-accent flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-primary">
                        Search for "<span className="font-medium">{query}</span>"
                      </div>
                      <div className="text-xs text-text-secondary mt-1">
                        Press Enter or click to search
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : query.length > 0 ? (
            <div className="p-4 text-center">
              <Icon name="Search" size={24} className="text-text-secondary mx-auto mb-2" />
              <p className="text-sm text-text-secondary">
                No suggestions found for "{query}"
              </p>
              <button
                onClick={() => handleSearch()}
                className="mt-2 text-sm text-accent hover:text-accent/80 font-medium"
              >
                Search anyway
              </button>
            </div>
          ) : (
            <div className="p-4 text-center">
              <Icon name="Search" size={24} className="text-text-secondary mx-auto mb-2" />
              <p className="text-sm text-text-secondary">
                Start typing to search news articles
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInterface;