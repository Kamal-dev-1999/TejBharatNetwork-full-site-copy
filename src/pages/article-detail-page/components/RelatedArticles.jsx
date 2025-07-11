import React, { useEffect, useState } from 'react';
import ArticleCard from '../../category-browse/components/ArticleCard';
import { API_ENDPOINTS } from '../../../config/api';

const RelatedArticles = ({ category, currentArticleId }) => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelated = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(API_ENDPOINTS.CATEGORY_ARTICLES(category));
        if (!response.ok) throw new Error('Failed to fetch related articles');
        const data = await response.json();
        // Exclude the current article
        const filtered = (data.articles || []).filter(a => a._id !== currentArticleId);
        // Map to ArticleCard props format
        setArticles(filtered.map(a => ({
          id: a._id,
          title: a.title,
          summary: a.summary,
          image: a.image_url || a.image || '',
          category: a.category,
          source: a.source,
          publishedAt: a.published_dt || '',
          readTime: a.full_text ? Math.max(1, Math.round((a.full_text || '').split(' ').length / 200)) : 5,
          isBookmarked: false // Optionally, implement bookmark logic
        })));
      } catch (err) {
        setError(err.message || 'Error loading related articles');
      } finally {
        setIsLoading(false);
      }
    };
    if (category && currentArticleId) fetchRelated();
  }, [category, currentArticleId]);

  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg p-6 mb-6">
        <div className="h-6 w-32 bg-neutral-200 rounded mb-6 animate-pulse" />
        {[1,2,3].map(i => (
          <div key={i} className="flex space-x-3 mb-4 animate-pulse">
            <div className="w-16 h-16 bg-neutral-200 rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="w-full h-4 bg-neutral-200 rounded" />
              <div className="w-2/3 h-4 bg-neutral-200 rounded" />
              <div className="w-1/2 h-3 bg-neutral-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="bg-surface rounded-lg p-6 text-error">{error}</div>;
  }

  if (!articles.length) {
    return <div className="bg-surface rounded-lg p-6 text-text-secondary">No related articles found.</div>;
  }

  return (
    <div className="bg-surface rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Related News</h2>
      <div className="space-y-4">
        {articles.slice(0, 4).map(article => (
          <ArticleCard key={article.id} article={article} onBookmark={() => {}} onShare={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles; 