import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from '../AppIcon';
import Button from './Button';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      size="xl"
      shape="circle"
      className={`w-12 h-12 p-0 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-border shadow-sm ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <Icon
        name={isDark ? 'Sun' : 'Moon'}
        size={28}
        className="text-yellow-500 dark:text-yellow-300 transition-colors duration-200"
      />
    </Button>
  );
};

export default ThemeToggle; 