import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const HeroSection = ({ featuredArticle }) => {
  if (!featuredArticle) {
    return (
      <div className="relative w-full h-96 bg-surface dark:bg-neutral-800 rounded-lg overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="h-4 bg-white/20 dark:bg-white/10 rounded mb-3"></div>
          <div className="h-8 bg-white/20 dark:bg-white/10 rounded mb-2"></div>
          <div className="h-4 bg-white/20 dark:bg-white/10 rounded w-3/4"></div>
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
    <div className="relative w-full flex flex-col md:flex-row gap-8 rounded-2xl overflow-hidden border border-border dark:border-border bg-surface dark:bg-surface">
      {/* Hero Image & Content */}
      <div className="relative w-full md:w-2/3 h-[28rem] md:h-[32rem] flex items-end">
        <Image
          src={featuredArticle.image}
          alt={featuredArticle.title}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Strong overlay for text clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/10 dark:from-black/95 dark:via-black/80" />
        {/* Glassmorphism Text Panel: only behind text, lower left */}
        <div className="relative z-10 w-full flex justify-start items-end pb-8 pl-8 md:pb-12 md:pl-12">
          <div className="group max-w-xl w-full bg-white/30 dark:bg-black/40 backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-col gap-4 shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-accent text-white dark:bg-accent-dark dark:text-white shadow">
                {featuredArticle.category}
              </span>
              <span className="text-sm text-white/90 font-medium">Featured</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white drop-shadow leading-tight line-clamp-2">
              {featuredArticle.title}
            </h1>
            <p className="text-base md:text-lg text-white/80 font-medium mb-1 line-clamp-2">
              {featuredArticle.excerpt}
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2">
              <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                <span>{featuredArticle.source}</span>
                <span className="text-lg font-bold">•</span>
                <span>{featuredArticle.publishedAt}</span>
              </div>
              <Link
                to={`/article-detail-page?id=${featuredArticle.id}&title=${encodeURIComponent(featuredArticle.title)}&category=${featuredArticle.category}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white dark:bg-accent-dark dark:text-white font-semibold hover:bg-accent/90 dark:hover:bg-accent-dark/90 transition text-base shadow"
              >
                Read more <Icon name="ArrowRight" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar: Professional News Scroll */}
      <div
        ref={politicsRef}
        className="hidden md:flex w-1/3 h-[32rem] bg-background/90 dark:bg-background/60 items-start justify-center p-6 overflow-y-auto border-l border-border dark:border-border no-scrollbar"
      >
        <div className="w-full flex flex-col gap-6 max-w-xs">
          {/* News Card 1 */}
          <div className="bg-surface dark:bg-neutral-900 rounded-2xl p-6 flex flex-col items-start border border-border dark:border-border transition-all duration-200 hover:scale-[1.03] hover:bg-white/30 hover:backdrop-blur-md hover:dark:bg-black/30">
            <span className="inline-block px-3 py-1 mb-3 rounded-full text-sm font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">Politics</span>
            <h3 className="text-lg font-bold text-primary dark:text-primary mb-2">Parliament Debates New Climate Bill</h3>
            <p className="text-base text-secondary dark:text-secondary mb-4">Lawmakers discuss a new bill aiming for net-zero emissions by 2040. Experts say this could reshape the nation's energy landscape.</p>
            <Link
              to="/category-browse?category=politics"
              className="inline-block px-5 py-2 rounded bg-red-700 text-white text-sm font-semibold hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-900 transition shadow"
            >
              Read More
            </Link>
          </div>
          {/* News Card 2 */}
          <div className="bg-surface dark:bg-neutral-900 rounded-2xl p-6 flex flex-col items-start border border-border dark:border-border transition-all duration-200 hover:scale-[1.03] hover:bg-white/30 hover:backdrop-blur-md hover:dark:bg-black/30">
            <span className="inline-block px-3 py-1 mb-3 rounded-full text-sm font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">Politics</span>
            <h3 className="text-lg font-bold text-primary dark:text-primary mb-2">Election Results Announced</h3>
            <p className="text-base text-secondary dark:text-secondary mb-4">The latest election brings major changes to parliament, with new leaders promising reform and transparency.</p>
            <Link
              to="/category-browse?category=politics"
              className="inline-block px-5 py-2 rounded bg-red-700 text-white text-sm font-semibold hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-900 transition shadow"
            >
              Read More
            </Link>
          </div>
          {/* News Card 3 */}
          <div className="bg-surface dark:bg-neutral-900 rounded-2xl p-6 flex flex-col items-start border border-border dark:border-border transition-all duration-200 hover:scale-[1.03] hover:bg-white/30 hover:backdrop-blur-md hover:dark:bg-black/30">
            <span className="inline-block px-3 py-1 mb-3 rounded-full text-sm font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">Politics</span>
            <h3 className="text-lg font-bold text-primary dark:text-primary mb-2">Government Unveils New Education Policy</h3>
            <p className="text-base text-secondary dark:text-secondary mb-4">A new education policy aims to improve access and quality for students nationwide, focusing on digital learning.</p>
            <Link
              to="/category-browse?category=politics"
              className="inline-block px-5 py-2 rounded bg-red-700 text-white text-sm font-semibold hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-900 transition shadow"
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
