import React, { useState, useEffect, useCallback } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ContextualBreadcrumbs from '../../components/ui/ContextualBreadcrumbs';
import HeroSection from './components/HeroSection';
import CategoryChips from './components/CategoryChips';
import ArticleGrid from './components/ArticleGrid';
import FloatingActionButton from './components/FloatingActionButton';
import RefreshIndicator from './components/RefreshIndicator';
import LoadMoreButton from './components/LoadMoreButton';
import Footer from './components/Footer';
import { API_ENDPOINTS } from '../../config/api';

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
    <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="20" fill="${backgroundColor}"/>
      <text x="25" y="30" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="white">${firstLetter}</text>
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + btoa(svg);
};

// Function to get source logo
const getSourceLogo = (sourceName) => {
  if (!sourceName) {
    console.log('NewsHomepage: No source name provided');
    return generateSourceLogo('Unknown');
  }
  
  console.log(`NewsHomepage: Generating logo for source: "${sourceName}"`);
  return generateSourceLogo(sourceName);
};

const NewsHomepage = () => {
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // Fetch articles from backend
  const fetchArticles = useCallback(async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      // Use grouped API to ensure all categories including Politics are included
      const response = await fetch(API_ENDPOINTS.GROUPED_ARTICLES);
      const groupedData = await response.json();
      
      // Flatten all articles from different categories
      let allArticles = [];
      Object.values(groupedData).forEach(categoryArticles => {
        if (Array.isArray(categoryArticles)) {
          allArticles = [...allArticles, ...categoryArticles];
        }
      });
      
      // Sort by fetched_at date (most recent first)
      allArticles.sort((a, b) => new Date(b.fetched_at) - new Date(a.fetched_at));
      
      // Apply pagination
      const startIndex = (pageNum - 1) * 20;
      const endIndex = startIndex + 20;
      const paginatedArticles = allArticles.slice(startIndex, endIndex);
      
      // Map backend fields to frontend props
      const mapped = paginatedArticles.map((a, idx) => {
        const sourceLogo = getSourceLogo(a.source);
        console.log(`NewsHomepage Article ${idx}: Source="${a.source}", Category="${a.category}", Logo="${sourceLogo.substring(0, 50)}..."`);
        return {
          id: a._id, // Always use MongoDB ObjectId, don't fallback to index
          title: a.title,
          summary: a.summary,
          excerpt: a.summary,
          image: (a.image_url || a.image || '').trim(),
          source: a.source,
          category: a.category,
          publishedAt: a.published_dt ? new Date(a.published_dt).toLocaleString() : '',
          readTime: a.full_text ? Math.max(1, Math.round((a.full_text || '').split(' ').length / 200)) + ' min read' : '',
          isBookmarked: false,
          link: a.link,
          author: {
            avatar: sourceLogo,
            name: a.source || 'Unknown'
          }
        };
      });
      
      if (isLoadMore) {
        // Append new articles to existing ones
        setArticles(prev => [...prev, ...mapped]);
        // Check if there are more articles
        setHasMore(endIndex < allArticles.length);
      } else {
        // Set initial articles
        setFeaturedArticle(mapped[0] || null);
        setArticles(mapped);
        setHasMore(endIndex < allArticles.length);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
    
    if (isLoadMore) {
      setIsLoadingMore(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    
    // Reset to page 1 and fetch fresh articles
    setPage(1);
    await fetchArticles(1, false);
    setHasMore(true);
    setIsRefreshing(false);
  }, [fetchArticles]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchArticles(nextPage, true);
  }, [page, isLoadingMore, hasMore, fetchArticles]);

  const handleBookmarkToggle = useCallback((articleId, isBookmarked) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, isBookmarked }
          : article
      )
    );
    
    if (featuredArticle && featuredArticle.id === articleId) {
      setFeaturedArticle(prev => ({ ...prev, isBookmarked }));
    }
    
    setBookmarkCount(prev => isBookmarked ? prev + 1 : prev - 1);
  }, [featuredArticle]);

  useEffect(() => {
    fetchArticles(1, false);
    // Refresh every 2 hours
    const interval = setInterval(() => fetchArticles(1, false), 2 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchArticles]);

  // Auto-slide featuredArticle every 5 seconds
  useEffect(() => {
    if (!articles.length) return;
    const interval = setInterval(() => {
      setFeaturedArticle(prev => {
        const currentIndex = articles.findIndex(a => a.id === prev?.id);
        const nextIndex = (currentIndex + 1) % articles.length;
        return articles[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [articles]);

  return (
    <div className="min-h-screen bg-surface">
      <HeaderNavigation />
      
      <main className="pt-16">
        <RefreshIndicator 
          onRefresh={handleRefresh} 
          isRefreshing={isRefreshing} 
        />
        
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ContextualBreadcrumbs />
          
          {/* Latest News Headline */}
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Latest News</h2>
          
          {/* Hero Section */}
          <section className="mb-8">
            <HeroSection featuredArticle={featuredArticle} />
          </section>
          
          {/* Category Navigation */}
          <section className="mb-8">
            <CategoryChips />
          </section>
          
          {/* Articles Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-text-secondary">
                {articles.length} articles
              </span>
            </div>
            
            <ArticleGrid
              articles={articles}
              isLoading={isLoading}
              onBookmarkToggle={handleBookmarkToggle}
            />
            
            {!isLoading && (
              <LoadMoreButton
                onLoadMore={handleLoadMore}
                isLoading={isLoadingMore}
                hasMore={hasMore}
              />
            )}
          </section>
        </div>
        
        <FloatingActionButton bookmarkCount={bookmarkCount} />
      </main>
      
      <Footer />
    </div>
  );
};

export default NewsHomepage;