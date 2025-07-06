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
import { API_ENDPOINTS } from '../../config/api';

const CATEGORIES = [
  "Breaking News", "Politics", "Mumbai", "National News", "International News",
  "Finance", "Aviation", "Technology", "Sports", "Entertainment", "Opinion"
];

const CategoryBrowse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  console.log('🔍 Raw category from URL:', category);
  console.log('🔍 Full URL:', location.pathname + location.search);
  
  const [activeSubcategory, setActiveSubcategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [groupedArticles, setGroupedArticles] = useState({});

  const showAllCategories = !searchParams.get('category');

  // Fetch articles (all or by category)
  const fetchArticles = async (reset = false, nextPage = 1) => {
    setIsLoading(true);
    try {
      let url;
      if (category) {
        url = `${API_ENDPOINTS.CATEGORY_ARTICLES(category)}?page=${nextPage}&limit=10`;
        console.log('🔍 Fetching category articles:', { category, url });
      } else {
        url = `${API_ENDPOINTS.LATEST_ARTICLES}?page=${nextPage}&limit=10`;
      }
      const response = await fetch(url);
      console.log('🔍 Response status:', response.status);
      const data = await response.json();
      console.log('🔍 Response data:', data);
      if (!response.ok) {
        console.error('🔍 Error response:', data);
      }
      const mapped = (data.articles || []).map((a, idx) => ({
        id: a._id || idx,
        title: a.title || '',
        summary: a.summary || '',
        excerpt: a.summary || '',
        image: (a.image_url || a.image || '').trim(),
        source: a.source || '',
        category: a.category || '',
        publishedAt: a.published_dt
          ? (typeof a.published_dt === 'string'
              ? new Date(a.published_dt).toLocaleString()
              : new Date(
                  a.published_dt.$date
                    ? typeof a.published_dt.$date === 'string'
                      ? parseInt(a.published_dt.$date)
                      : a.published_dt.$date.$numberLong
                    : a.published_dt
                ).toLocaleString())
          : '',
        readTime: a.full_text
          ? Math.max(1, Math.round((a.full_text || '').split(' ').length / 200)) + ' min read'
          : '1 min read',
        isBookmarked: false,
        link: a.link || '',
        author: {
          avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
          name: a.source || 'Unknown'
        }
      }));
      setArticles(reset ? mapped : prev => [...prev, ...mapped]);
      setPage(data.page || nextPage);
      setTotalPages(data.totalPages || 1);
      setHasMore((data.page || nextPage) < (data.totalPages || 1));
    } catch (error) {
      setArticles([]);
      setHasMore(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArticles(true, 1);
    fetchGroupedArticles();
  }, [category, activeSubcategory, sortBy]);

  const fetchGroupedArticles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.GROUPED_CATEGORIES}?limit=4`);
      const data = await response.json();
      setGroupedArticles(data);
    } catch (error) {
      setGroupedArticles({});
    }
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    await fetchArticles(true, 1);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchArticles(false, page + 1);
    }
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
    return category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Technology';
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    const published = new Date(date);
    if (isNaN(published.getTime())) return '';
    const now = new Date();
    const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return published.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      
      <PullToRefresh onRefresh={handleRefresh}>
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <ContextualBreadcrumbs />

            {showAllCategories ? (
              // Show grouped articles for all categories
              CATEGORIES.filter(category => (groupedArticles[category] && groupedArticles[category].length > 0)).map(category => (
                <div key={category}>
                  <h2 className="text-2xl font-bold my-4">{category}</h2>
                  <ArticleGrid
                    articles={(groupedArticles[category] || []).map((a, idx) => ({
                      id: a._id || idx,
                      title: a.title || '',
                      summary: a.summary || '',
                      excerpt: a.summary || '',
                      image: (a.image_url || a.image || '').trim(),
                      source: a.source || '',
                      category: a.category || '',
                      publishedAt: a.published_dt
                        ? (typeof a.published_dt === 'string'
                            ? new Date(a.published_dt).toLocaleString()
                            : new Date(
                                a.published_dt.$date
                                  ? typeof a.published_dt.$date === 'string'
                                    ? parseInt(a.published_dt.$date)
                                    : a.published_dt.$date.$numberLong
                                  : a.published_dt
                              ).toLocaleString())
                        : '',
                      readTime: a.full_text
                        ? Math.max(1, Math.round((a.full_text || '').split(' ').length / 200)) + ' min read'
                        : '1 min read',
                      isBookmarked: false,
                      link: a.link || '',
                      author: {
                        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
                        name: a.source || 'Unknown'
                      }
                    }))}
                    isLoading={isLoading}
                    onBookmark={() => {}}
                    onShare={() => {}}
                  />
                </div>
              ))
            ) : (
              // Show single category view (original logic)
              <>
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
                {!isLoading && hasMore && (
                  <LoadMoreButton
                    onLoadMore={handleLoadMore}
                    isLoading={isLoading}
                    hasMore={hasMore}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </PullToRefresh>
    </div>
  );
};

export default CategoryBrowse;


