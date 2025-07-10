import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import ArticleGrid from "../news-homepage/components/ArticleGrid";
import { API_ENDPOINTS } from "../../config/api";
import ErrorBoundary from "../../components/ErrorBoundary";
import ScrollToTop from "../../components/ScrollToTop";
import Icon from "../../components/AppIcon";
import Image from "../../components/AppImage";
import HeaderNavigation from "../../components/ui/HeaderNavigation";
import ContextualBreadcrumbs from "../../components/ui/ContextualBreadcrumbs";

const RESULTS_PER_PAGE = 12;

const SearchResultsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Reset page and articles when search changes
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setTotalPages(1);
  }, [keyword, category]);

  const fetchArticles = useCallback(async (nextPage = 1, append = false) => {
    setIsLoading(true);
    setError(null);
    try {
      let articlesData = [];
      let totalPagesFromApi = 1;
      let hasMoreFromApi = false;
      if (keyword) {
        // Use search API (GET)
        const params = new URLSearchParams({
          q: keyword,
          category,
          page: nextPage,
          limit: RESULTS_PER_PAGE
        });
        const response = await fetch(`${API_ENDPOINTS.SEARCH_ARTICLES}?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch articles");
        const data = await response.json();
        articlesData = data.articles || [];
        totalPagesFromApi = data.totalPages || 1;
        hasMoreFromApi = (data.page || nextPage) < totalPagesFromApi;
      } else if (category) {
        // Use category API
        const response = await fetch(`${API_ENDPOINTS.CATEGORY_ARTICLES(category)}?page=${nextPage}&limit=${RESULTS_PER_PAGE}`);
        if (!response.ok) throw new Error("Failed to fetch articles");
        const data = await response.json();
        articlesData = data.articles || [];
        totalPagesFromApi = data.totalPages || 1;
        hasMoreFromApi = (data.page || nextPage) < totalPagesFromApi;
      }
      // Map backend fields to frontend props (similar to category-browse)
      const mapped = (articlesData || []).map((a, idx) => ({
        id: a._id || idx + (nextPage - 1) * RESULTS_PER_PAGE,
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
          name: a.source || 'Unknown',
        },
      }));
      setArticles(prev => append ? [...prev, ...mapped] : mapped);
      setPage(nextPage);
      setTotalPages(totalPagesFromApi);
      setHasMore(hasMoreFromApi);
    } catch (err) {
      setError(err.message);
      setArticles([]);
      setHasMore(false);
    }
    setIsLoading(false);
  }, [keyword, category]);

  // Fetch on mount and when keyword/category/page changes
  useEffect(() => {
    fetchArticles(1, false);
    // eslint-disable-next-line
  }, [keyword, category, fetchArticles]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchArticles(page + 1, true);
    }
  };

  return (
    <ErrorBoundary>
      <ScrollToTop />
      {/* Custom global scrollbar styles */}
      <style>{`
        /* For Chrome, Edge, Safari */
        ::-webkit-scrollbar {
          width: 12px;
          background: #f3f4f6;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #f87171 0%, #2563eb 100%);
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border: 2px solid #f3f4f6;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563eb 0%, #f87171 100%);
        }
        ::-webkit-scrollbar-corner {
          background: #f3f4f6;
        }
        /* For Firefox */
        html {
          scrollbar-width: thin;
          scrollbar-color: #f87171 #f3f4f6;
        }
      `}</style>
      <HeaderNavigation />
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ContextualBreadcrumbs />
          <div className="flex items-center gap-2 mb-6">
            <Icon name="Search" size={28} className="text-primary" />
            <h1 className="text-2xl font-bold">Search Results</h1>
          </div>
          {error && (
            <div className="text-red-600 mb-4">{error}</div>
          )}
          <ArticleGrid articles={articles} isLoading={isLoading} />
          {!isLoading && hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors duration-200"
                disabled={isLoading}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SearchResultsPage;
