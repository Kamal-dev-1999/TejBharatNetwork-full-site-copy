import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ContextualBreadcrumbs from '../../components/ui/ContextualBreadcrumbs';
import ArticleHeader from './components/ArticleHeader';
import ArticleContent from './components/ArticleContent';
import FloatingToolbar from './components/FloatingToolbar';
// import RelatedArticles from './components/RelatedArticles';
// import TrendingTopics from './components/TrendingTopics';
import LoadingState from './components/LoadingState';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Source logo mapping with real logos
const SOURCE_LOGOS = {
  'Times of India': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Times_of_India_logo.svg/1200px-Times_of_India_logo.svg.png',
  'Hindustan Times': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Hindustan_Times_logo.svg/1200px-Hindustan_Times_logo.svg.png',
  'The Hindu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/The_Hindu_logo.svg/1200px-The_Hindu_logo.svg.png',
  'Indian Express': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/The_Indian_Express_logo.svg/1200px-The_Indian_Express_logo.svg.png',
  'Economic Times': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/The_Economic_Times_logo.svg/1200px-The_Economic_Times_logo.svg.png',
  'Business Standard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Business_Standard_logo.svg/1200px-Business_Standard_logo.svg.png',
  'Mint': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Mint_logo.svg/1200px-Mint_logo.svg.png',
  'Livemint': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Mint_logo.svg/1200px-Mint_logo.svg.png',
  'NDTV': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/NDTV_logo.svg/1200px-NDTV_logo.svg.png',
  'CNN-News18': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/CNN-News18_logo.svg/1200px-CNN-News18_logo.svg.png',
  'India Today': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/India_Today_logo.svg/1200px-India_Today_logo.svg.png',
  'Outlook': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Outlook_logo.svg/1200px-Outlook_logo.svg.png',
  'The Wire': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/The_Wire_logo.svg/1200px-The_Wire_logo.svg.png',
  'Scroll.in': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Scroll.in_logo.svg/1200px-Scroll.in_logo.svg.png',
  'The Quint': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/The_Quint_logo.svg/1200px-The_Quint_logo.svg.png',
  'News18': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/News18_logo.svg/1200px-News18_logo.svg.png',
  'Zee News': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Zee_News_logo.svg/1200px-Zee_News_logo.svg.png',
  'ABP News': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/ABP_News_logo.svg/1200px-ABP_News_logo.svg.png',
  'Republic TV': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Republic_TV_logo.svg/1200px-Republic_TV_logo.svg.png',
  'Times Now': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Times_Now_logo.svg/1200px-Times_Now_logo.svg.png'
};

// Function to generate fallback logo with letter
const generateFallbackLogo = (sourceName) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#A9CCE3', '#F9E79F', '#D5A6BD', '#A2D9CE', '#FAD7A0'
  ];
  
  let hash = 0;
  for (let i = 0; i < sourceName.length; i++) {
    hash = sourceName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  const backgroundColor = colors[colorIndex];
  
  const firstLetter = sourceName.charAt(0).toUpperCase();
  const svg = `
    <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="20" fill="${backgroundColor}"/>
      <text x="25" y="30" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="white">${firstLetter}</text>
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + btoa(svg);
};

// Function to get source logo with fallback
const getSourceLogo = (sourceName) => {
  if (!sourceName) {
    console.log('No source name provided, using default logo');
    return 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=50&h=50&fit=crop';
  }
  
  console.log(`Looking for logo for source: "${sourceName}"`);
  
  // Try exact match first
  if (SOURCE_LOGOS[sourceName]) {
    console.log(`Found exact match for "${sourceName}"`);
    return SOURCE_LOGOS[sourceName];
  }
  
  // Try partial match
  const sourceLower = sourceName.toLowerCase().trim();
  for (const [key, logo] of Object.entries(SOURCE_LOGOS)) {
    const keyLower = key.toLowerCase();
    if (sourceLower.includes(keyLower) || keyLower.includes(sourceLower)) {
      console.log(`Found partial match: "${sourceName}" matches "${key}"`);
      return logo;
    }
  }
  
  // Try common variations
  const variations = {
    'timesofindia': 'Times of India',
    'hindustantimes': 'Hindustan Times',
    'thehindu': 'The Hindu',
    'indianexpress': 'Indian Express',
    'economictimes': 'Economic Times',
    'businessstandard': 'Business Standard',
    'ndtv': 'NDTV',
    'cnnnews18': 'CNN-News18',
    'indiatoday': 'India Today',
    'thewire': 'The Wire',
    'scroll': 'Scroll.in',
    'thequint': 'The Quint',
    'news18': 'News18',
    'zeenews': 'Zee News',
    'abpnews': 'ABP News',
    'republictv': 'Republic TV',
    'timesnow': 'Times Now'
  };
  
  const sourceClean = sourceLower.replace(/[^a-z]/g, '');
  if (variations[sourceClean]) {
    const matchedSource = variations[sourceClean];
    console.log(`Found variation match: "${sourceName}" -> "${matchedSource}"`);
    return SOURCE_LOGOS[matchedSource];
  }
  
  // Generate fallback logo with letter
  console.log(`No logo found for "${sourceName}", generating fallback with letter`);
  return generateFallbackLogo(sourceName);
};

const ArticleDetailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState(null);

  const articleId = searchParams.get('id');
  const articleTitle = searchParams.get('title');
  const articleCategory = searchParams.get('category');

  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Loading article with ID:', articleId);
        
        // Fetch article from backend API
        const response = await fetch(`http://localhost:4000/api/articles/${articleId}`);
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', errorData);
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);
        
        if (!data.article) {
          console.error('No article data in response');
          setError("Article not found");
          return;
        }

        // Transform backend data to frontend format
        const transformedArticle = {
          id: data.article._id,
          title: data.article.title,
          summary: data.article.summary,
          content: data.article.full_text || data.article.summary,
          category: data.article.category,
          author: {
            name: data.article.source || 'Unknown',
            role: 'Reporter',
            avatar: getSourceLogo(data.article.source)
          },
          source: {
            name: data.article.source || 'Unknown',
            logo: getSourceLogo(data.article.source)
          },
          imageUrl: data.article.image_url || data.article.image || '',
          publishedAt: data.article.published_dt ? new Date(data.article.published_dt).toLocaleString() : '',
          readingTime: data.article.full_text ? Math.max(1, Math.round((data.article.full_text || '').split(' ').length / 200)) : 5,
          views: "1.2k",
          link: data.article.link
        };

        console.log('Transformed article:', transformedArticle);
        setArticle(transformedArticle);
        
        // Check if article is bookmarked (simulate from localStorage)
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
        setIsBookmarked(bookmarks.includes(articleId));
        
      } catch (err) {
        console.error('Failed to load article:', err);
        setError(err.message || "Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) {
      loadArticle();
    } else {
      setError("No article ID provided");
      setIsLoading(false);
    }
  }, [articleId]);

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
    
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter(id => id !== articleId);
      localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      const updatedBookmarks = [...bookmarks, articleId];
      localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedBookmarks));
      setIsBookmarked(true);
    }
  };

  const handleShare = (platform, article) => {
    const url = window.location.href;
    const text = `Check out this article: ${article.title}`;
    
    switch (platform) {
      case 'Twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'Facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'LinkedIn':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'WhatsApp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'Copy Link':
        navigator.clipboard.writeText(url);
        // You could add a toast notification here
        break;
      default:
        break;
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/news-homepage');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoadingState />
          </div>
        </main>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
              <h1 className="text-2xl font-heading font-bold text-primary mb-2">
                {error || "Article Not Found"}
              </h1>
              <p className="text-text-secondary mb-6">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Button
                variant="primary"
                onClick={handleGoBack}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Go Back
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              iconName="ArrowLeft"
              iconPosition="left"
              className="text-text-secondary hover:text-primary"
            >
              Back
            </Button>
          </div>

          {/* Breadcrumbs */}
          <ContextualBreadcrumbs />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-2">
              <ArticleHeader
                article={article}
                onBookmark={handleBookmark}
                isBookmarked={isBookmarked}
              />
              
              <ArticleContent
                content={article.content}
                readingTime={article.readingTime}
              />
            </div>

            {/* Sidebar */}
            {/* <div className="space-y-6">
              <RelatedArticles
                articles={mockArticles}
                currentArticleId={article.id}
              />
              
              <TrendingTopics />
            </div> */}
          </div>
        </div>
      </main>

      {/* Floating Toolbar */}
      <FloatingToolbar
        article={article}
        onShare={handleShare}
        onBookmark={handleBookmark}
        isBookmarked={isBookmarked}
      />
    </div>
  );
};

export default ArticleDetailPage;