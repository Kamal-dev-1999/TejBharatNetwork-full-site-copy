import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
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
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" fill="${backgroundColor}"/>
      <text x="10" y="13" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle" fill="white">${firstLetter}</text>
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + btoa(svg);
};

// Function to get source logo
const getSourceLogo = (sourceName) => {
  if (!sourceName) {
    console.log('ArticleCard: No source name provided');
    return generateSourceLogo('Unknown');
  }
  
  console.log(`ArticleCard: Generating logo for source: "${sourceName}"`);
  return generateSourceLogo(sourceName);
};

const ArticleCard = ({ article, onBookmarkToggle }) => {
  const [isBookmarked, setIsBookmarked] = useState(article?.isBookmarked || false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  // Larger card, more prominent shadow, solid background
  const cardBaseClass = 'shadow-lg rounded-lg transition-transform duration-300 bg-white';

  const handleBookmarkClick = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarkLoading) return;
    setIsBookmarkLoading(true);
    try {
      const newBookmarkState = !isBookmarked;
      setIsBookmarked(newBookmarkState);
      if (onBookmarkToggle) {
        await onBookmarkToggle(article?.id, newBookmarkState);
      }
    } catch (error) {
      setIsBookmarked(isBookmarked);
      console.error('Bookmark toggle failed:', error);
    } finally {
      setIsBookmarkLoading(false);
    }
  }, [isBookmarked, isBookmarkLoading, onBookmarkToggle, article?.id]);

  const handleShare = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const shareData = {
        title: article?.title,
        text: article?.excerpt,
        url: `${window.location.origin}/article-detail-page?id=${article?.id}&title=${encodeURIComponent(article?.title || '')}&category=${article?.category || ''}`
      };
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        const url = shareData.url;
        await navigator.clipboard.writeText(url);
        const shareButton = e.currentTarget;
        const originalText = shareButton.getAttribute('aria-label');
        shareButton.setAttribute('aria-label', 'Link copied!');
        setTimeout(() => {
          shareButton.setAttribute('aria-label', originalText);
        }, 2000);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  }, [article]);

  if (!article) {
    return null;
  }

  // Debug: Log the logo URL being used
  const logoUrl = getSourceLogo(article.source);
  console.log(`ArticleCard: Article "${article.title}" from "${article.source}" using logo:`, logoUrl);

  return (
    <article className={`news-card group ${cardBaseClass}`}>
      <Link 
        to={`/article-detail-page?id=${article.id}&title=${encodeURIComponent(article.title)}&category=${article.category}`}
        className="block"
      >
        {/* Article Image */}
        <div className="relative w-full h-44 overflow-hidden rounded-t-lg">
          <Image
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent text-white">
              {article.category}
            </span>
          </div>
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={handleBookmarkClick}
              disabled={isBookmarkLoading}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 touch-target disabled:opacity-50"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarkLoading ? (
                <Icon name="Loader2" size={16} className="animate-spin text-text-secondary" />
              ) : (
                <Icon 
                  name="Bookmark" 
                  size={16} 
                  className={isBookmarked ? 'text-accent fill-current' : 'text-text-secondary'} 
                />
              )}
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 touch-target"
              aria-label="Share article"
            >
              <Icon name="Share2" size={16} className="text-text-secondary" />
            </button>
          </div>
        </div>
        {/* Article Content */}
        <div className="p-6">
          {/* Article Title */}
          <h3 className="text-xl font-article font-normal text-black group-hover:text-red-600 transition-colors duration-200 mb-2">
            {article.title}
          </h3>
          {/* Article Excerpt */}
          <p className="text-base text-text-secondary mb-3 line-clamp-3">
            {article.excerpt}
          </p>
          {/* Article Meta */}
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <img
                  src={logoUrl}
                  alt={article.source}
                  className="w-4 h-4 rounded object-cover"
                />
                <span className="font-medium">{article.source}</span>
              </div>
              <span>•</span>
              <span>{article.publishedAt}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ArticleCard;
