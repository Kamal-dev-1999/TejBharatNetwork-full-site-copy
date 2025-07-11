import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ContextualBreadcrumbs from '../../components/ui/ContextualBreadcrumbs';
import BookmarkCard from './components/BookmarkCard';
import { useAuth } from '../../contexts/AuthContext';
import { API_ENDPOINTS } from '../../config/api';

const BookmarksLibrary = () => {
  const navigate = useNavigate();
  const { currentUser, bookmarks: bookmarkIds, removeBookmark } = useAuth();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || bookmarkIds.length === 0) {
      setArticles([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    Promise.all(
      bookmarkIds.map(id =>
        fetch(API_ENDPOINTS.SINGLE_ARTICLE(id))
          .then(r => r.ok ? r.json() : null)
          .then(js => js?.article || null)
          .catch(() => null)
      )
    )
      .then(list => setArticles(list.filter(a => a)))
      .finally(() => setIsLoading(false));
  }, [currentUser, bookmarkIds]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Loading Bookmarks - NewsHub</title>
        </Helmet>
        <HeaderNavigation />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-neutral-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Bookmarks Library - NewsHub</title>
        <meta name="description" content="Manage and organize your saved articles in your personal reading library" />
      </Helmet>

      <HeaderNavigation />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ContextualBreadcrumbs />

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                No bookmarks yet
              </h3>
              <p className="text-text-secondary">
                Start saving articles to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <BookmarkCard
                  key={article._id}
                  bookmark={{
                    id: article._id,
                    title: article.title,
                    summary: article.summary,
                    content: article.full_text || article.summary,
                    category: article.category,
                    source: article.source,
                    image: article.image_url || article.image || '',
                    savedDate: article.savedDate || article.published_dt || null, // fallback
                  }}
                  onRemove={() => removeBookmark(article._id)}
                  onOpen={() => navigate(`/article-detail-page?id=${article._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookmarksLibrary;