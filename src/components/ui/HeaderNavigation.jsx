import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import SearchInterface from './SearchInterface';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';

const DEFAULT_USER_IMG = "/assets/images/default-user.png";

const HeaderNavigation = () => {
  const { currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const navigationItems = [
    { label: 'Home', path: '/news-homepage', icon: 'Home' },
    { label: 'Categories', path: '/category-browse', icon: 'Grid3X3', hasDropdown: true },
    { label: 'Bookmarks', path: '/bookmarks-library', icon: 'Bookmark' },
    // Removed Settings from here
  ];

  const categories = [
    { label: 'Breaking News', path: '/category-browse?category=Breaking News' },
    { label: 'Politics', path: '/category-browse?category=Politics' },
    { label: 'Mumbai', path: '/category-browse?category=Mumbai' },
    { label: 'National News', path: '/category-browse?category=National News' },
    { label: 'International News', path: '/category-browse?category=International News' },
    { label: 'Finance', path: '/category-browse?category=Finance' },
    { label: 'Aviation', path: '/category-browse?category=Aviation' },
    { label: 'Technology', path: '/category-browse?category=Technology' },
    { label: 'Fact Check', path: '/category-browse?category=Fact Check' },
    { label: 'Sports', path: '/category-browse?category=Sports' },
    { label: 'Entertainment', path: '/category-browse?category=Entertainment' },
    { label: 'Opinion', path: '/category-browse?category=Opinion' },
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

  const handleProfileClick = () => {
    setIsProfileDropdownOpen((open) => !open);
  };

  const handleProfileMenu = (e) => {
    e.preventDefault();
    setIsProfileDropdownOpen(false);
    navigate('/user-settings');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      //   setIsCategoryDropdownOpen(false);
      // }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsCategoryDropdownOpen(false);
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
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
    <header className="fixed top-0 left-0 right-0 z-header bg-background border-b border-border safe-area-inset-top overflow-x-visible">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div>
            <Link 
              to="/news-homepage" 
              className="flex items-center space-x-2 group"
              onClick={closeMobileMenu}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center transition-colors duration-200 overflow-hidden">
                <img 
                  src="/assets/images/tej-bharat-network-logo.png" 
                  alt="तेज भारत NETWORK Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-heading font-bold text-primary transition-colors duration-200 hidden sm:inline">
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
          <div className="flex items-center space-x-4 flex-shrink-0 min-w-0">
            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchInterface />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Info or Login/Sign Up Buttons */}
            <div className="relative flex items-center space-x-2">
              {!currentUser ? (
                <>
                  <Link to="/signin" className="btn btn-outline text-sm font-medium px-4 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-50 transition-colors duration-200 hidden lg:inline-block">
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-primary text-sm font-medium px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 hidden lg:inline-block">
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    className="flex items-center space-x-2 px-2 py-1 rounded-full border border-border hover:bg-surface transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
                    onClick={handleProfileClick}
                  >
                    <img
                      src={currentUser.photoURL || DEFAULT_USER_IMG}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="hidden md:inline text-sm font-medium text-primary">
                      {currentUser.displayName || currentUser.email || 'Account'}
                    </span>
                    <Icon name="ChevronDown" size={16} />
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                      <button
                        className="w-full text-left px-4 py-3 text-sm text-primary hover:bg-surface rounded-t-lg"
                        onClick={handleProfileMenu}
                      >
                        <Icon name="User" size={16} className="mr-2 inline-block" />
                        Profile & Settings
                      </button>
                      {/* You can add more dropdown items here if needed */}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              onClick={toggleMobileMenu}
              className="lg:hidden touch-target"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={28} />
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

              {/* Mobile Theme Toggle */}
              <div className="flex justify-center">
                <ThemeToggle />
              </div>

              {/* Mobile User Info */}
              {currentUser && (
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={currentUser.photoURL || DEFAULT_USER_IMG}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-primary">{currentUser.displayName || currentUser.email || 'Account'}</div>
                    <button
                      className="text-xs text-accent underline mt-1"
                      onClick={() => { setIsMobileMenuOpen(false); navigate('/user-settings'); }}
                    >
                      Profile & Settings
                    </button>
                  </div>
                </div>
              )}

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
                          <>
                            {console.log('Rendering mobile category list')}
                            <div className="mt-2 ml-4 space-y-1 max-h-60 overflow-y-auto sm:max-h-80">
                              {categories.map((category) => (
                                <button
                                  type="button"
                                  key={category.path}
                                  className={`flex items-center justify-between px-4 py-2 rounded-md text-sm transition-colors duration-200 w-full text-left ${
                                    isActiveRoute(category.path)
                                      ? 'text-red-600 bg-red-100' : 'text-text-secondary hover:text-red-600 hover:bg-red-50'
                                  }`}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    console.log("Navigating to:", category.path);
                                    navigate(category.path);
                                    setTimeout(() => {
                                      console.log("Closing mobile menu");
                                      closeMobileMenu();
                                    }, 100);
                                  }}
                                >
                                  <span>{category.label}</span>
                                  <span className="text-xs font-mono">{category.count}</span>
                                </button>
                              ))}
                            </div>
                          </>
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

              {/* Mobile Login/Sign Up Buttons */}
              {!currentUser && (
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
