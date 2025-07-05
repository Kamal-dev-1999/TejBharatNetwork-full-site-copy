import React from 'react';
import ArticleCard from '../../category-browse/components/ArticleCard';
import Icon from '../../../components/AppIcon';


const ArticleGrid = ({ articles, isLoading, onBookmarkToggle }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="news-card">
            <div className="w-full h-48 bg-neutral-200 rounded-t-lg animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-neutral-200 rounded animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-3 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-3 bg-neutral-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-3 bg-neutral-200 rounded w-4/6 animate-pulse"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-neutral-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="FileText" size={24} className="text-text-secondary" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-primary mb-2">
          No articles found
        </h3>
        <p className="text-text-secondary">
          Check back later for the latest news updates.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onBookmark={() => {}}
          onShare={() => {}}
          className="h-full flex flex-col"
        />
      ))}
    </div>
  );
};

export default ArticleGrid;