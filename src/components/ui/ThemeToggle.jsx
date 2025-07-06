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
      className={`w-10 h-10 p-0 ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <Icon
        name={isDark ? 'Sun' : 'Moon'}
        size={18}
        className="text-text-secondary hover:text-primary transition-colors duration-200"
      />
    </Button>
  );
};

export default ThemeToggle; 