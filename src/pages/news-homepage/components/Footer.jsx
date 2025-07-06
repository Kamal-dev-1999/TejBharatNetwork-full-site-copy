import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="public/assets/images/tej-bharat-network-logo.png" alt="NewsHub Logo" />
            </div>
            <span className="text-lg font-semibold text-primary">TejBharatNetwork</span>
          </div>

          {/* Quick Links */}
          <div className="flex items-center space-x-6 text-sm">
            <Link 
              to="/category-browse?category=Mumbai" 
              className="text-text-secondary hover:text-primary transition-colors duration-200"
            >
              Mumbai
            </Link>
            <Link 
              to="/category-browse?category=Politics" 
              className="text-text-secondary hover:text-primary transition-colors duration-200"
            >
              Politics
            </Link>
            <Link 
              to="/category-browse?category=Sports" 
              className="text-text-secondary hover:text-primary transition-colors duration-200"
            >
              Sports
            </Link>
            <Link 
              to="/search-results" 
              className="text-text-secondary hover:text-primary transition-colors duration-200"
            >
              Search
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-text-secondary">
            © {currentYear} TejBharatNetwork. All rights reserved.
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-secondary">
            <div className="flex items-center space-x-4">
              <span>Stay informed with the latest news</span>
              <span>•</span>
              <span>Real-time updates</span>
              <span>•</span>
              <span>Multiple sources</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Heart" size={12} className="text-red-500" />
              <span>Made with care for news enthusiasts</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 