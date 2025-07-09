import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const ContextualBreadcrumbs = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Home', path: '/news-homepage', icon: 'Home' }
    ];

    switch (location.pathname) {
      case '/news-homepage': case'/':
        return [{ label: 'Home', path: '/news-homepage', icon: 'Home', current: true }];

      case '/category-browse':
        const category = searchParams.get('category');
        if (category) {
          breadcrumbs.push(
            { label: 'Categories', path: '/category-browse', icon: 'Grid3X3' },
            { 
              label: category.charAt(0).toUpperCase() + category.slice(1), 
              path: `/category-browse?category=${category}`, 
              current: true 
            }
          );
        } else {
          breadcrumbs.push({ label: 'Categories', path: '/category-browse', icon: 'Grid3X3', current: true });
        }
        break;

      case '/search-results':
        const query = searchParams.get('q');
        breadcrumbs.push(
          { label: 'Search', path: '/search-results', icon: 'Search' },
          { 
            label: query ? `"${query}"` : 'Results', 
            path: location.pathname + location.search, 
            current: true 
          }
        );
        break;

      case '/article-detail-page':
        const articleId = searchParams.get('id');
        const articleTitle = searchParams.get('title');
        const articleCategory = searchParams.get('category');
        
        if (articleCategory) {
          breadcrumbs.push(
            { label: 'Categories', path: '/category-browse', icon: 'Grid3X3' },
            { 
              label: articleCategory.charAt(0).toUpperCase() + articleCategory.slice(1), 
              path: `/category-browse?category=${articleCategory}` 
            }
          );
        }
        
        breadcrumbs.push({
          label: articleTitle ? (articleTitle.length > 50 ? articleTitle.substring(0, 50) + '...' : articleTitle) : 'Article',
          path: location.pathname + location.search,
          icon: 'FileText',
          current: true
        });
        break;

      case '/bookmarks-library':
        breadcrumbs.push({ label: 'Bookmarks', path: '/bookmarks-library', icon: 'Bookmark', current: true });
        break;

      case '/user-settings':
        breadcrumbs.push({ label: 'Settings', path: '/user-settings', icon: 'Settings', current: true });
        break;

      default:
        breadcrumbs.push({ label: 'Page', path: location.pathname, current: true });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center w-full text-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-text-secondary mx-2 flex-shrink-0" 
              />
            )}
            
            {breadcrumb.current ? (
              <span className="flex items-center space-x-1 text-primary font-medium">
                {breadcrumb.icon && (
                  <Icon 
                    name={breadcrumb.icon} 
                    size={14} 
                    className="text-text-secondary" 
                  />
                )}
                <span
                  className="truncate max-w-[90px] sm:max-w-[120px] md:max-w-[180px] overflow-hidden text-ellipsis block"
                  title={breadcrumb.label}
                >
                  {breadcrumb.label}
                </span>
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="flex items-center space-x-1 text-text-secondary hover:text-primary transition-colors duration-200 group"
              >
                {breadcrumb.icon && (
                  <Icon 
                    name={breadcrumb.icon} 
                    size={14} 
                    className="group-hover:text-primary transition-colors duration-200" 
                  />
                )}
                <span className="truncate max-w-xs sm:max-w-sm hover:underline">
                  {breadcrumb.label}
                </span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ContextualBreadcrumbs;