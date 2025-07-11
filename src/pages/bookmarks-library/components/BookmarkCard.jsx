import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookmarkCard = ({ bookmark, onRemove, onOpen, isSelected, onSelect }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      await onRemove?.(bookmark?.id);
    } catch (error) {
      console.error('Remove bookmark failed:', error);
    } finally {
      setIsRemoving(false);
    }
  }, [isRemoving, onRemove, bookmark?.id]);

  const handleSelect = useCallback((e) => {
    if (onSelect) {
      onSelect(bookmark?.id, e.target.checked);
    }
  }, [onSelect, bookmark?.id]);

  const formatDate = (date) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Unknown";
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(d);
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.split(' ')?.length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  if (!bookmark) {
    return null;
  }

  return (
    <div className={`news-card p-4 transition-all duration-200 ${isSelected ? 'ring-2 ring-accent bg-accent/5' : ''}`}>
      <div className="flex items-start space-x-4">
        {/* Selection Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={handleSelect}
            className="w-4 h-4 text-accent bg-background border-border rounded focus:ring-accent focus:ring-2"
          />
        </div>

        {/* Article Image */}
        <div className="flex-shrink-0">
          <Link
            to={`/article-detail-page?id=${bookmark.id}&title=${encodeURIComponent(bookmark.title)}&category=${bookmark.category}`}
            className="block"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-surface">
              <Image
                src={bookmark.image}
                alt={bookmark.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>
        </div>

        {/* Article Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2 text-xs text-text-secondary">
              <span className="bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
                {bookmark.category}
              </span>
              <span>•</span>
              <span>{bookmark.source}</span>
              {bookmark.isOfflineAvailable && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Icon name="Download" size={12} className="text-success" />
                    <span className="text-success">Offline</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {bookmark.syncStatus === 'synced' && (
                <Icon name="Cloud" size={14} className="text-success" />
              )}
              {bookmark.syncStatus === 'syncing' && (
                <Icon name="CloudUpload" size={14} className="text-warning animate-pulse" />
              )}
              {bookmark.syncStatus === 'error' && (
                <Icon name="CloudOff" size={14} className="text-error" />
              )}
            </div>
          </div>

          <Link
            to={`/article-detail-page?id=${bookmark.id}&title=${encodeURIComponent(bookmark.title)}&category=${bookmark.category}`}
            className="block group"
          >
            <h3 className="text-sm sm:text-base font-semibold text-primary group-hover:text-accent transition-colors duration-200 line-clamp-2 mb-2">
              {bookmark.title}
            </h3>
          </Link>

          <p className="text-sm text-text-secondary line-clamp-2 mb-3">
            {bookmark.summary}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-text-secondary">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={12} />
                <span>Saved {formatDate(bookmark.savedDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>{getReadingTime(bookmark.content)} min read</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {bookmark.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-neutral-100 text-text-secondary px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {bookmark.tags.length > 3 && (
                <span className="text-xs text-text-secondary">
                  +{bookmark.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="danger"
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-xs px-2 py-1"
            iconName={isRemoving ? "Loader2" : "Trash2"}
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;