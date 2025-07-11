import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';

// Source-specific color mapping for better visual distinction
const SOURCE_COLORS = {
  'Times of India': '#1E40AF', // Blue
  'Hindustan Times': '#DC2626', // Red
  'The Hindu': '#059669', // Green
  'Indian Express': '#7C3AED', // Purple
  'Economic Times': '#D97706', // Orange
  'Business Standard': '#0891B2', // Cyan
  'Mint': '#059669', // Green
  'Livemint': '#059669', // Green
  'NDTV': '#DC2626', // Red
  'CNN-News18': '#1E40AF', // Blue
  'India Today': '#DC2626', // Red
  'Outlook': '#7C3AED', // Purple
  'The Wire': '#059669', // Green
  'Scroll.in': '#DC2626', // Red
  'The Quint': '#7C3AED', // Purple
  'News18': '#DC2626', // Red
  'Zee News': '#1E40AF', // Blue
  'ABP News': '#DC2626', // Red
  'Republic TV': '#DC2626', // Red
  'Times Now': '#1E40AF' // Blue
};

// Function to generate source logo with letter
const generateSourceLogo = (sourceName) => {
  // Try to get source-specific color first
  let backgroundColor = SOURCE_COLORS[sourceName];
  
  // If no specific color, try partial match
  if (!backgroundColor) {
    const sourceLower = sourceName.toLowerCase().trim();
    for (const [key, color] of Object.entries(SOURCE_COLORS)) {
      const keyLower = key.toLowerCase();
      if (sourceLower.includes(keyLower) || keyLower.includes(sourceLower)) {
        backgroundColor = color;
        break;
      }
    }
  }
  
  // If still no color, use fallback colors
  if (!backgroundColor) {
    const fallbackColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
      '#A9CCE3', '#F9E79F', '#D5A6BD', '#A2D9CE', '#FAD7A0'
    ];
    
    let hash = 0;
    for (let i = 0; i < sourceName.length; i++) {
      hash = sourceName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % fallbackColors.length;
    backgroundColor = fallbackColors[colorIndex];
  }
  
  const firstLetter = sourceName.charAt(0).toUpperCase();
  const svg = `
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${backgroundColor}"/>
      <text x="12" y="16" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="white">${firstLetter}</text>
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + btoa(svg);
};

// Function to get source logo
const getSourceLogo = (sourceName) => {
  if (!sourceName) {
    console.log('CategoryArticleCard: No source name provided');
    return generateSourceLogo('Unknown');
  }
  
  console.log(`CategoryArticleCard: Generating logo for source: "${sourceName}"`);
  return generateSourceLogo(sourceName);
};

const ArticleCard = ({ article }) => {
  const { currentUser, toggleBookmark, isBookmarked } = useAuth();
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);

  const handleBookmarkClick = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      setShowLoginWarning(true);
      setTimeout(() => setShowLoginWarning(false), 2000);
      return;
    }
    if (isBookmarkLoading) return;
    setIsBookmarkLoading(true);
    try {
      await toggleBookmark(article.id);
    } catch (error) {
      console.error('Bookmark toggle failed:', error);
    } finally {
      setIsBookmarkLoading(false);
    }
  }, [currentUser, toggleBookmark, article.id, isBookmarkLoading]);

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // onShare(article); // This prop is removed, so this line is removed.
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const published = new Date(date);
    const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return published.toLocaleDateString();
  };

  // Get the source logo
  const logoUrl = getSourceLogo(article.source);
  console.log(`CategoryArticleCard: Article "${article.title}" from "${article.source}" using logo:`, logoUrl);

  return (
    <article className="news-card news-card-hover group">
      <Link
        to={`/article-detail-page?id=${article.id}&title=${encodeURIComponent(article.title)}&category=${article.category}`}
        className="block"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <Image
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent text-white dark:bg-accent-dark dark:text-white shadow">
              {article.category}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex space-x-1">
            <Button
              variant="ghost"
              onClick={handleBookmarkClick}
              className="w-8 h-8 bg-surface/90 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface dark:hover:bg-neutral-700 transition-colors duration-200 touch-target border border-border dark:border-border focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark"
              iconName={undefined}
              iconSize={14}
            >
              {isBookmarkLoading ? (
                <Icon name="Loader2" size={16} className="animate-spin text-text-secondary" />
              ) : (
                <Icon
                  name={isBookmarked(article.id) ? "Bookmark" : "BookmarkPlus"}
                  size={16}
                  className={isBookmarked(article.id) ? "text-accent fill-current" : "text-text-secondary"}
                />
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleShare}
              className="w-8 h-8 bg-surface/90 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface dark:hover:bg-neutral-700 transition-colors duration-200 touch-target border border-border dark:border-border focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark"
              iconName="Share2"
              iconSize={14}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Meta */}
          <div className="flex items-center space-x-2 text-xs text-text-secondary mb-2">
            <span>{article.source}</span>
            <span>•</span>
            <span>{getTimeAgo(article.publishedAt)}</span>
            <span>•</span>
            <span>{article.readTime} min read</span>
          </div>

          {/* Title with hover effect */}
          <h3 className="text-lg font-normal text-primary dark:text-primary group-hover:text-red-600 transition-colors duration-200 mb-2 line-clamp-2">
            {article.title}
          </h3>

          {/* Summary */}
          <p className="text-normal text-text-secondary text-sm line-clamp-3 mb-4">
            {article.summary}
          </p>

          {/* Author */}
          <div className="flex items-center space-x-2">
            <img
              src={logoUrl}
              alt={article.source}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-text-secondary">
              {article.source}
            </span>
          </div>
          {showLoginWarning && (
            <div className="text-xs text-red-600 mt-2">Please login to bookmark</div>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ArticleCard;
