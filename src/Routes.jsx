import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import NewsHomepage from "pages/news-homepage";
import ArticleDetailPage from "pages/article-detail-page";
import CategoryBrowse from "pages/category-browse";
import SearchResults from "pages/search-results";
import BookmarksLibrary from "pages/bookmarks-library";
import UserSettings from "pages/user-settings";
import NotFound from "pages/NotFound";
import SignIn from "pages/user-settings/components/SignIn";
import SignUp from "pages/user-settings/components/SignUp";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<NewsHomepage />} />
        <Route path="/news-homepage" element={<NewsHomepage />} />
        <Route path="/article-detail-page" element={<ArticleDetailPage />} />
        <Route path="/category-browse" element={<CategoryBrowse />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/bookmarks-library" element={<BookmarksLibrary />} />
        <Route path="/user-settings" element={<UserSettings />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
