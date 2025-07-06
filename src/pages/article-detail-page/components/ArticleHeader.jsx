import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ArticleHeader = ({ article, onBookmark, isBookmarked }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="w-full mb-8">
      {/* Hero Image with Overlay */}
      <div className="relative w-full h-80 md:h-[28rem] lg:h-[32rem] overflow-hidden rounded-2xl mb-8 shadow-lg">
        <Image
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/10 dark:from-black/90 dark:via-black/50" />
        {/* Meta Glass Panel */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-white/30 dark:bg-black/40 backdrop-blur-md rounded-b-2xl flex flex-col md:flex-row md:items-end md:justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3 mb-2 md:mb-0">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-accent text-white dark:bg-accent-dark dark:text-white shadow drop-shadow-md">
              {article.category}
            </span>
            <span className="text-base text-white font-medium drop-shadow-md">
              {formatDate(article.publishedAt)}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Source Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 overflow-hidden rounded shadow">
                <Image
                  src={article.source.logo}
                  alt={article.source.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-base text-gray-100 font-medium drop-shadow-md">
                {article.source.name}
              </span>
            </div>
            {/* Bookmark Button */}
            <button
              onClick={onBookmark}
              className={`p-3 rounded-full transition-colors duration-200 shadow-lg border border-border focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark group relative
                ${isBookmarked
                  ? 'bg-accent text-white'
                  : 'bg-white text-accent hover:bg-gray-100 dark:bg-neutral-900 dark:text-accent'}
              `}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Icon 
                name={isBookmarked ? 'Bookmark' : 'BookmarkPlus'} 
                size={22} 
              />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                {isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Title and Summary */}
      <div className="space-y-4 px-1 md:px-2">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary leading-tight drop-shadow-md">
          {article.title}
        </h1>
        {article.summary && (
          <p className="text-xl text-text-secondary leading-relaxed font-medium">
            {article.summary}
          </p>
        )}
        {/* Author Info */}
        <div className="flex items-center gap-4 pt-4 border-t border-border mt-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 overflow-hidden rounded-full shadow">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-base font-semibold text-primary">
                {article.author.name}
              </p>
              <p className="text-xs text-text-secondary">
                {article.author.role} at {article.source.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;