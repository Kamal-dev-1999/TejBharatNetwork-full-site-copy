import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ContextualBreadcrumbs from '../../components/ui/ContextualBreadcrumbs';
import CategoryBanner from './components/CategoryBanner';
import SubcategoryTabs from './components/SubcategoryTabs';
import SortDropdown from './components/SortDropdown';
import ArticleGrid from './components/ArticleGrid';
import LoadMoreButton from './components/LoadMoreButton';
import PullToRefresh from './components/PullToRefresh';
import Icon from '../../components/AppIcon';

const CategoryBrowse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category') || 'technology';
  
  const [activeSubcategory, setActiveSubcategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadInitialData();
  }, [category, activeSubcategory, sortBy]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/articles?category=${encodeURIComponent(category)}&page=1&limit=10`
      );
      const data = await response.json();
      setArticles(data.articles || []);
      setFeaturedArticle(data.articles && data.articles.length > 0 ? data.articles[0] : null);
      setPage(1);
      setHasMore(data.totalPages > 1);
    } catch (error) {
      setArticles([]);
      setFeaturedArticle(null);
      setHasMore(false);
    }
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    await loadInitialData();
  };

  const handleLoadMore = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock additional articles
    const additionalArticles = mockArticles.map((article, index) => ({
      ...article,
      id: `article-${page * 6 + index + 1}`,
      title: `${article.title} - Page ${page + 1}`,
      publishedAt: new Date(Date.now() - (24 + page * 6 + index) * 60 * 60 * 1000)
    }));
    
    setArticles(prev => [...prev, ...additionalArticles]);
    setPage(prev => prev + 1);
    
    // Simulate end of content after 3 pages
    if (page >= 3) {
      setHasMore(false);
    }
    
    setIsLoading(false);
  };

  const handleBookmark = (articleId) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, isBookmarked: !article.isBookmarked }
        : article
    ));
  };

  const handleShare = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.origin + `/article-detail-page?id=${article.id}`
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(
        window.location.origin + `/article-detail-page?id=${article.id}`
      );
      // You could show a toast notification here
    }
  };

  const handleSubcategoryChange = (subcategory) => {
    setActiveSubcategory(subcategory);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const getCategoryDisplayName = () => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      
      <PullToRefresh onRefresh={handleRefresh}>
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <ContextualBreadcrumbs />

            {/* Category Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Icon name="Grid3X3" size={24} color="white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-primary">
                    {getCategoryDisplayName()}
                  </h1>
                  <p className="text-text-secondary">
                    Latest news and updates in {category}
                  </p>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="hidden sm:block">
                <SortDropdown sortBy={sortBy} onSortChange={handleSortChange} />
              </div>
            </div>

            {/* Featured Article Banner */}
            {featuredArticle && !isLoading && (
              <CategoryBanner 
                featuredArticle={featuredArticle} 
                category={getCategoryDisplayName()} 
              />
            )}

            {/* Subcategory Tabs */}
            <SubcategoryTabs
              category={category}
              activeSubcategory={activeSubcategory}
              onSubcategoryChange={handleSubcategoryChange}
            />

            {/* Mobile Sort */}
            <div className="sm:hidden mb-6">
              <SortDropdown sortBy={sortBy} onSortChange={handleSortChange} />
            </div>

            {/* Articles Grid */}
            <ArticleGrid
              articles={articles}
              isLoading={isLoading}
              onBookmark={handleBookmark}
              onShare={handleShare}
            />

            {/* Load More */}
            {!isLoading && articles.length > 0 && (
              <LoadMoreButton
                onLoadMore={handleLoadMore}
                isLoading={isLoading}
                hasMore={hasMore}
              />
            )}
          </div>
        </main>
      </PullToRefresh>
    </div>
  );
};

export default CategoryBrowse;


