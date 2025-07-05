import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const HeroSection = ({ featuredArticle }) => {
  if (!featuredArticle) {
    return (
      <div className="relative w-full h-96 bg-neutral-200 rounded-lg overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="h-4 bg-white/20 rounded mb-3"></div>
          <div className="h-8 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // Add this ref
  const politicsRef = useRef(null);

  // Add this effect for auto-scroll
  useEffect(() => {
    const container = politicsRef.current;
    if (!container) return;
    let scrollStep = 1;
    let delay = 30; // ms between steps

    function autoScroll() {
      if (container.scrollTop + container.clientHeight < container.scrollHeight) {
        container.scrollTop += scrollStep;
        setTimeout(autoScroll, delay);
      }
    }
    autoScroll();
  }, []);

  return (
    <div className="
      relative w-full
      aspect-[4/3]         // Mobile: taller
      md:aspect-[16/6]     // Desktop: wide and short
      rounded-lg overflow-hidden flex flex-col md:flex-row
      border border-gray-200 bg-transparent
    ">
      {/* Main News (left side) */}
      <div className="relative w-full md:w-2/3 h-full">
        <Link
          to={`/article-detail-page?id=${featuredArticle.id}&title=${encodeURIComponent(featuredArticle.title)}&category=${featuredArticle.category}`}
          className="block w-full h-full group"
        >
          <Image
            src={featuredArticle.image}
            alt={featuredArticle.title}
            className="w-full h-full object-cover"
            style={{ aspectRatio: '16/9' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center space-x-2 mb-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent text-white">
                {featuredArticle.category}
              </span>
              <span className="text-sm opacity-80">Featured</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold mb-3 line-clamp-2 text-primary group-hover:text-red-600 transition-colors duration-200">
              {featuredArticle.title}
            </h1>
            <p className="text-base opacity-90 line-clamp-2 mb-4">
              {featuredArticle.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">{featuredArticle.source}</span>
                <span className="text-sm opacity-70">•</span>
                <span className="text-sm opacity-70">{featuredArticle.publishedAt}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                <span>Read more</span>
                <Icon name="ArrowRight" size={16} />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Politics News Only (right side) */}
      <div
        ref={politicsRef}
        className="hidden md:flex w-1/3 h-full bg-background/80 items-start justify-center p-4 overflow-y-auto border-l border-gray-200 no-scrollbar"
      >
        <div className="w-full flex flex-col gap-4 max-w-xs">
          {/* Politics Card 1 */}
          <div className="bg-white rounded-lg p-4 flex flex-col items-start transition-transform duration-200 hover:scale-105 border border-gray-200">
            <span className="inline-block px-2 py-1 mb-2 rounded-full text-xs font-medium bg-red-100 text-red-700">Politics</span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Parliament Debates New Climate Bill</h3>
            <p className="text-sm text-gray-700 mb-4">Lawmakers discuss a new bill aiming for net-zero emissions by 2040. Experts say this could reshape the nation's energy landscape.</p>
            <Link
              to="/category-browse?category=politics"
              className="inline-block px-4 py-2 rounded bg-red-700 text-white text-xs font-semibold hover:bg-red-800 transition"
            >
              Read More
            </Link>
          </div>
          {/* Politics Card 2 */}
          <div className="bg-white rounded-lg p-4 flex flex-col items-start transition-transform duration-200 hover:scale-105 border border-gray-200">
            <span className="inline-block px-2 py-1 mb-2 rounded-full text-xs font-medium bg-red-100 text-red-700">Politics</span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Election Results Announced</h3>
            <p className="text-sm text-gray-700 mb-4">The latest election brings major changes to parliament, with new leaders promising reform and transparency.</p>
            <Link
              to="/category-browse?category=politics"
              className="inline-block px-4 py-2 rounded bg-red-700 text-white text-xs font-semibold hover:bg-red-800 transition"
            >
              Read More
            </Link>
          </div>
          {/* Politics Card 3 */}
          <div className="bg-white rounded-lg p-4 flex flex-col items-start transition-transform duration-200 hover:scale-105 border border-gray-200">
            <span className="inline-block px-2 py-1 mb-2 rounded-full text-xs font-medium bg-red-100 text-red-700">Politics</span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Government Unveils New Education Policy</h3>
            <p className="text-sm text-gray-700 mb-4">A new education policy aims to improve access and quality for students nationwide, focusing on digital learning.</p>
            <Link
              to="/category-browse?category=politics"
              className="inline-block px-4 py-2 rounded bg-red-700 text-white text-xs font-semibold hover:bg-red-800 transition"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
