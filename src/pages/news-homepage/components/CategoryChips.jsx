import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const CategoryChips = () => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);
  const location = useLocation();

  const categories = [
    { name: 'Breaking News', path: '/category-browse?category=Breaking News', icon: 'Home' },
    { name: 'Mumbai', path: '/category-browse?category=Mumbai', icon: 'Globe' },
    { name: 'National News', path: '/category-browse?category=National News', icon: 'Globe' },
    { name: 'International News', path: '/category-browse?category=International News', icon: 'Globe' },
    { name: 'Finance', path: '/category-browse?category=Finance', icon: 'TrendingUp' },
    { name: 'Aviation', path: '/category-browse?category=Aviation', icon: 'Airplane' },
    { name: 'Technology', path: '/category-browse?category=Technology', icon: 'Cpu' },
    { name: 'Fact Check', path: '/category-browse?category=Fact Check', icon: 'CheckCircle' },
    { name: 'Sports', path: '/category-browse?category=Sports', icon: 'Activity' },
    { name: 'Entertainment', path: '/category-browse?category=Entertainment', icon: 'Film' },
    { name: 'Opinion', path: '/category-browse?category=Opinion', icon: 'MessageSquare' },
  ];

  const checkScrollButtons = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scroll = (direction) => {
    scrollContainerRef.current?.scrollBy({ left: direction * 240, behavior: 'smooth' });
  };

  const isActiveCategory = (path) => {
    if (path === '/news-homepage') {
      return location.pathname === '/' || location.pathname === '/news-homepage';
    }
    return location.pathname + location.search === path;
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', checkScrollButtons);
    return () => {
      container?.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, []);

  return (
    <>
      {/* Hide scrollbar for all browsers */}
      <style>{`.category-scroll::-webkit-scrollbar { display: none; }
.category-scroll { scrollbar-width: none; -ms-overflow-style: none; }`}</style>

      <div className="relative mb-10 mt-8">
        {/* Left Scroll */}
        <button
          onClick={() => scroll(-1)}
          disabled={!canScrollLeft}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white transition-opacity duration-300 ${
            canScrollLeft ? 'opacity-100 hover:shadow-lg hover:bg-gray-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll left"
        >
          <Icon name="ChevronLeft" size={24} className="text-gray-600" />
        </button>

        {/* Chips Container */}
        <div
          ref={scrollContainerRef}
          className="category-scroll flex space-x-6 overflow-x-auto scroll-smooth py-4 px-10 bg-gray-50 rounded-xl"
        >
          {categories.map((category) => {
            const isActive = isActiveCategory(category.path);
            return (
              <Link
                key={category.name}
                to={category.path}
                className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0 font-semibold text-lg
                  ${
                    isActive
                      ? 'bg-red-600 text-white ring-2 ring-red-500'
                      : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-lg'
                  }
                `}
              >
                <Icon
                  name={category.icon}
                  size={24}
                  className={isActive ? 'text-white' : 'text-red-600 group-hover:text-red-600'}
                />
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Scroll */}
        <button
          onClick={() => scroll(1)}
          disabled={!canScrollRight}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white transition-opacity duration-300 ${
            canScrollRight ? 'opacity-100 hover:shadow-lg hover:bg-gray-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll right"
        >
          <Icon name="ChevronRight" size={24} className="text-gray-600" />
        </button>
      </div>
    </>
  );
};

export default CategoryChips;
