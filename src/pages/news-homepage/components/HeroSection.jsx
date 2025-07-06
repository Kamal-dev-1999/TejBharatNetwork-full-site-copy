import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const HeroSection = ({ featuredArticle }) => {
  const [politicsArticles, setPoliticsArticles] = useState([]);
  const [isLoadingPolitics, setIsLoadingPolitics] = useState(true);
  const politicsRef = useRef(null);

  // Fetch politics articles from database
  useEffect(() => {
    const fetchPoliticsArticles = async () => {
      setIsLoadingPolitics(true);
      try {
        const response = await fetch('http://localhost:4000/api/articles/latest/National%20News?limit=3');
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          const mappedArticles = data.articles.map(article => ({
            id: article._id,
            title: article.title,
            summary: article.summary,
            category: article.category,
            source: article.source,
            publishedAt: article.published_dt 
              ? new Date(article.published_dt).toLocaleString() 
              : '',
            link: `/article-detail-page?id=${article._id}&title=${encodeURIComponent(article.title)}&category=${article.category}`
          }));
          setPoliticsArticles(mappedArticles);
        }
      } catch (error) {
        console.error('Failed to fetch politics articles:', error);
        setPoliticsArticles([]);
      } finally {
        setIsLoadingPolitics(false);
      }
    };

    fetchPoliticsArticles();
  }, []);

  // Auto-scroll effect for politics sidebar - scrolls to bottom and stops
  useEffect(() => {
    const container = politicsRef.current;
    if (!container || politicsArticles.length === 0) return;
    
    // Scroll to bottom smoothly and stay there
    const scrollToBottom = () => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    };

    // Small delay to ensure content is rendered
    const timer = setTimeout(scrollToBottom, 500);
    
    return () => clearTimeout(timer);
  }, [politicsArticles]);

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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-600 text-white dark:bg-red-600 dark:text-white shadow">
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 text-white dark:bg-red-600 dark:text-white font-semibold hover:bg-red-700 dark:hover:bg-red-700 transition text-base shadow"
              >
                Read more <Icon name="ArrowRight" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Sidebar: Dynamic Politics News from Database */}
      <div className="hidden md:flex w-1/3 h-[32rem] bg-gradient-to-b from-background/95 to-background/80 dark:from-background/90 dark:to-background/70 backdrop-blur-sm border-l border-border/50 dark:border-border/50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-400"></div>
        <div className="absolute top-4 right-4 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
        <div className="absolute top-12 right-8 w-1 h-1 bg-red-400 rounded-full animate-pulse delay-1000"></div>
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-red-100 to-white dark:from-red-900/20 dark:to-white/10 backdrop-blur-sm border-b border-border/30 dark:border-border/30">
          <div className="flex items-center gap-3 px-6 py-4">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-400 rounded-lg flex items-center justify-center shadow-lg">
              <Icon name="Newspaper" size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary dark:text-primary">Latest News</h3>
              <p className="text-xs text-text-secondary dark:text-text-secondary">Stay updated with breaking stories</p>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <style>{`.hero-scrollbar::-webkit-scrollbar { display: none; }
.hero-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }`}</style>
        <div
          ref={politicsRef}
          className="hero-scrollbar w-full h-full pt-20 pb-6 px-6 overflow-y-auto scrollbar-thin scrollbar-thumb-red-200 dark:scrollbar-thumb-red-800 scrollbar-track-transparent"
        >
          <div className="w-full flex flex-col gap-4">
            {isLoadingPolitics ? (
              // Enhanced loading skeleton
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="group bg-white/60 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl p-5 border border-border/50 dark:border-border/50 animate-pulse hover:bg-white/80 dark:hover:bg-neutral-900 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-3 bg-gradient-to-r from-red-200 to-red-100 dark:from-red-800 dark:to-red-700 rounded-full w-16"></div>
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                  </div>
                  <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                    <div className="h-8 bg-gradient-to-r from-red-600 to-red-400 rounded-lg w-24"></div>
                  </div>
                </div>
              ))
            ) : politicsArticles.length > 0 ? (
              // Enhanced article cards
              politicsArticles.map((article, index) => (
                <div 
                  key={article.id} 
                  className="group bg-white/70 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl p-5 border border-border/50 dark:border-border/50 transition-all duration-300 hover:scale-[1.02] hover:bg-red-50 hover:dark:bg-neutral-900/90 hover:shadow-lg hover:border-red-400 dark:hover:border-red-600 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Category badge with gradient */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-600 to-red-400 text-white shadow-sm">
                      {article.category}
                    </span>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Article title */}
                  <h3 className="text-base font-bold text-primary dark:text-primary mb-3 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-600 transition-colors duration-200">
                    {article.title}
                  </h3>
                  
                  {/* Article summary */}
                  <p className="text-sm text-text-secondary dark:text-text-secondary mb-4 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                  
                  {/* Footer with source, time, and read button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-text-secondary">
                      <Icon name="Clock" size={12} className="text-red-600" />
                      <span>{article.source}</span>
                      <span className="text-red-600">•</span>
                      <span>{article.publishedAt}</span>
                    </div>
                    <Link
                      to={article.link}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-400 text-white text-xs font-semibold hover:from-red-700 hover:to-red-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Read <Icon name="ArrowRight" size={12} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Enhanced empty state
              <div className="bg-white/60 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center justify-center border border-border/50 dark:border-border/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-white/10 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Newspaper" size={32} className="text-red-600 dark:text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-primary mb-2">No News Available</h3>
                <p className="text-sm text-text-secondary dark:text-text-secondary">Check back later for the latest updates</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/80 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default HeroSection;
