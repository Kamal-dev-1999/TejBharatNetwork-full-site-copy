import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from '../AppIcon';
import Button from './Button';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      size="xl"
      shape="circle"
      className={`w-12 h-12 p-0 bg-gray-100 dark:bg-gray-800 border border-border shadow-sm flex items-center justify-center ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Icon
          name="Moon"
          size={28}
          className="text-blue-200 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] dark:text-blue-400 dark:drop-shadow-[0_0_12px_rgba(96,165,250,1)]"
        />
      ) : (
        <Icon
          name="Sun"
          size={28}
          className="text-yellow-400 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] dark:text-yellow-300 dark:drop-shadow-[0_0_12px_rgba(253,224,71,1)]"
        />
      )}
    </Button>
  );
};

export default ThemeToggle; 