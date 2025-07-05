import React, { useState, useEffect, useCallback } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ContextualBreadcrumbs from '../../components/ui/ContextualBreadcrumbs';
import HeroSection from './components/HeroSection';
import CategoryChips from './components/CategoryChips';
import ArticleGrid from './components/ArticleGrid';
import FloatingActionButton from './components/FloatingActionButton';
import RefreshIndicator from './components/RefreshIndicator';
import LoadMoreButton from './components/LoadMoreButton';

const API_URL = 'http://localhost:4000/api/articles2/latest?limit=20';

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
  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      // Map backend fields to frontend props
      const mapped = (data.articles || []).map((a, idx) => ({
        id: a._id || idx,
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
          avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', // Placeholder
          name: a.source || 'Unknown'
        }
      }));
      setFeaturedArticle(mapped[0] || null);
      setArticles(mapped);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
    setIsLoading(false);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    
    // Simulate refresh API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Shuffle articles to simulate new content
    const shuffled = [...articles].sort(() => Math.random() - 0.5);
    const featured = shuffled[0];
    const remainingArticles = shuffled.slice(1, 11);
    
    setFeaturedArticle(featured);
    setArticles(remainingArticles);
    setPage(1);
    setHasMore(true);
    setIsRefreshing(false);
  }, [articles]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    // Simulate load more API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newArticles = articles.slice(0, 10).map(article => ({
      ...article,
      id: article.id + (page * 10),
      publishedAt: `${page + 1} day${page > 0 ? 's' : ''} ago`
    }));
    
    setArticles(prev => [...prev, ...newArticles]);
    setPage(prev => prev + 1);
    
    // Simulate reaching end of content
    if (page >= 3) {
      setHasMore(false);
    }
    
    setIsLoadingMore(false);
  }, [page, isLoadingMore, hasMore, articles]);

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
    fetchArticles();
    // Refresh every 2 hours
    const interval = setInterval(fetchArticles, 2 * 60 * 60 * 1000);
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
    </div>
  );
};

export default NewsHomepage;