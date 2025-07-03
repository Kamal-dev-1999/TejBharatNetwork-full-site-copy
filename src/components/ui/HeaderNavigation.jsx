import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import SearchInterface from './SearchInterface';
import { useAuth } from "../../contexts/AuthContext";

const DEFAULT_USER_IMG = "/assets/images/default-user.png";

const HeaderNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { user, logout } = useAuth();

  const navigationItems = [
    { label: 'Home', path: '/news-homepage', icon: 'Home' },
    { label: 'Categories', path: '/category-browse', icon: 'Grid3X3', hasDropdown: true },
    { label: 'Bookmarks', path: '/bookmarks-library', icon: 'Bookmark' },
    { label: 'Settings', path: '/user-settings', icon: 'Settings' },
  ];

  const categories = [
    { label: 'Politics', path: '/category-browse?category=politics', count: 245 },
    { label: 'Technology', path: '/category-browse?category=technology', count: 189 },
    { label: 'Business', path: '/category-browse?category=business', count: 156 },
    { label: 'Sports', path: '/category-browse?category=sports', count: 134 },
    { label: 'Health', path: '/category-browse?category=health', count: 98 },
    { label: 'Science', path: '/category-browse?category=science', count: 87 },
    { label: 'Entertainment', path: '/category-browse?category=entertainment', count: 76 },
    { label: 'World', path: '/category-browse?category=world', count: 203 },
  ];

  const isActiveRoute = (path) => {
    if (path === '/news-homepage') {
      return location.pathname === '/' || location.pathname === '/news-homepage';
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsCategoryDropdownOpen(false);
  };

  const toggleCategoryDropdown = (e) => {
    e.preventDefault();
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsCategoryDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-header bg-background border-b border-border safe-area-inset-top">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/news-homepage" 
              className="flex items-center space-x-2 group"
              onClick={closeMobileMenu}
            >
              <div className="w-16 h-16 rounded-lg flex items-center justify-center transition-colors duration-200 overflow-hidden">
                <img 
                  src="/assets/images/tej-bharat-network-logo.png" 
                  alt="तेज भारत NETWORK Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-heading font-bold text-primary transition-colors duration-200">
                तेज भारत NETWORK
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.path} className="relative" ref={item.hasDropdown ? dropdownRef : null}>
                {item.hasDropdown ? (
                  <button
                    onClick={toggleCategoryDropdown}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 touch-target ${
                      isActiveRoute(item.path)
                        ? 'text-red-600 bg-red-100' :'text-text-secondary hover:text-red-600 hover:bg-red-50'
                    }`}
                    aria-expanded={isCategoryDropdownOpen}
                    aria-haspopup="true"
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                    <Icon 
                      name="ChevronDown" 
                      size={14} 
                      className={`transform transition-transform duration-200 ${
                        isCategoryDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 touch-target ${
                      isActiveRoute(item.path)
                        ? 'text-red-600 bg-red-100' :'text-text-secondary hover:text-red-600 hover:bg-red-50'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </Link>
                )}

                {/* Category Dropdown */}
                {item.hasDropdown && (
                  <div className={`contextual-menu top-full left-0 mt-2 w-80 ${isCategoryDropdownOpen ? 'show' : ''}`}>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-primary mb-3">Browse Categories</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <Link
                            key={category.path}
                            to={category.path}
                            className={`flex items-center justify-between p-2 rounded-md transition-colors duration-200 ${
                              isActiveRoute(category.path)
                                ? 'text-red-600 bg-red-100' : 'hover:bg-red-50 hover:text-red-600 text-text-primary'
                            }`}
                            onClick={() => setIsCategoryDropdownOpen(false)}
                          >
                            <span className="text-sm">{category.label}</span>
                            <span className="text-xs text-text-secondary font-mono">{category.count}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <Link
                          to="/category-browse"
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                          onClick={() => setIsCategoryDropdownOpen(false)}
                        >
                          View All Categories →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchInterface />
            </div>

            {/* User Info or Login/Sign Up Buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <img src={DEFAULT_USER_IMG} alt="Default Profile" className="w-8 h-8 rounded-full bg-gray-200" />
                )}
                <span>{user.displayName || user.email}</span>
                <Button variant="outline" onClick={logout} className="ml-2">Logout</Button>
              </div>
            ) : (
              <>
                <Link to="/signin" className="btn btn-outline text-sm font-medium px-4 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-50 transition-colors duration-200 hidden lg:inline-block">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary text-sm font-medium px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 hidden lg:inline-block">
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              onClick={toggleMobileMenu}
              className="lg:hidden touch-target"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-overlay bg-background/95 backdrop-blur-sm lg:hidden">
          <div 
            ref={mobileMenuRef}
            className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-news-lg"
          >
            <div className="px-4 py-6 space-y-6">
              {/* Mobile Search */}
              <div className="md:hidden">
                <SearchInterface />
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.path}>
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={toggleCategoryDropdown}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 touch-target ${
                            isActiveRoute(item.path)
                              ? 'text-red-600 bg-red-100' :'text-text-secondary hover:text-red-600 hover:bg-red-50'
                          }`}
                          aria-expanded={isCategoryDropdownOpen}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon name={item.icon} size={20} />
                            <span>{item.label}</span>
                          </div>
                          <Icon 
                            name="ChevronDown" 
                            size={16} 
                            className={`transform transition-transform duration-200 ${
                              isCategoryDropdownOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {/* Mobile Category List */}
                        {isCategoryDropdownOpen && (
                          <div className="mt-2 ml-4 space-y-1">
                            {categories.map((category) => (
                              <Link
                                key={category.path}
                                to={category.path}
                                className={`flex items-center justify-between px-4 py-2 rounded-md text-sm transition-colors duration-200 ${
                                  isActiveRoute(category.path)
                                    ? 'text-red-600 bg-red-100' : 'text-text-secondary hover:text-red-600 hover:bg-red-50'
                                }`}
                                onClick={closeMobileMenu}
                              >
                                <span>{category.label}</span>
                                <span className="text-xs font-mono">{category.count}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 touch-target ${
                          isActiveRoute(item.path)
                            ? 'text-red-600 bg-red-100' :'text-text-secondary hover:text-red-600 hover:bg-red-50'
                        }`}
                        onClick={closeMobileMenu}
                      >
                        <Icon name={item.icon} size={20} />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile User Info or Login/Sign Up Buttons */}
              {user ? (
                <div className="flex flex-col items-center space-y-2 pt-4">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full" />
                  ) : (
                    <img src={DEFAULT_USER_IMG} alt="Default Profile" className="w-12 h-12 rounded-full bg-gray-200" />
                  )}
                  <span>{user.displayName || user.email}</span>
                  <Button variant="outline" onClick={logout} className="w-full mt-2">Logout</Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-4">
                  <Link to="/signin" className="btn btn-outline text-base font-medium px-4 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-center">
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-primary text-base font-medium px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 w-full text-center">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Status Indicator */}
              <div className="flex items-center justify-center pt-4 border-t border-border">
                <div className="status-indicator status-online">
                  <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                  <span>Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderNavigation;
