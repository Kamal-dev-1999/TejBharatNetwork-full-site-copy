// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  // Articles
  LATEST_ARTICLES: `${API_BASE_URL}/api/articles2/latest`,
  GROUPED_ARTICLES: `${API_BASE_URL}/api/latest-by-category`,
  CATEGORY_ARTICLES: (category) => `${API_BASE_URL}/api/articles/category/${encodeURIComponent(category)}`,
  LATEST_BY_CATEGORY: (category) => `${API_BASE_URL}/api/articles/latest/${encodeURIComponent(category)}`,
  SINGLE_ARTICLE: (id) => `${API_BASE_URL}/api/articles/${id}`,
  GROUPED_CATEGORIES: `${API_BASE_URL}/api/articles/grouped`,
  
  // Search
  SEARCH_ARTICLES: `${API_BASE_URL}/api/articles/search`,
  
  // Test
  TEST_ENDPOINT: `${API_BASE_URL}/api/test`,
};

export default API_BASE_URL; 