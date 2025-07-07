import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <label
      className={`relative inline-flex items-center cursor-pointer select-none ${className}`}
      aria-label="Toggle dark mode"
    >
      {/* Hidden checkbox for accessibility */}
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        className="sr-only peer"
        aria-checked={isDark}
      />
      {/* Track */}
      <div className="w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full peer-focus:ring-2 peer-focus:ring-primary transition-colors duration-300" />
      {/* Thumb */}
      <span
        className={`
          absolute left-1 top-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900
          shadow-md flex items-center justify-center
          transition-all duration-300
          peer-checked:translate-x-6
        `}
      >
        {isDark ? (
          <Moon size={18} className="text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]" />
        ) : (
          <Sun size={18} className="text-yellow-400 drop-shadow-[0_0_6px_rgba(253,224,71,0.7)]" />
        )}
      </span>
    </label>
  );
};

export default ThemeToggle; 