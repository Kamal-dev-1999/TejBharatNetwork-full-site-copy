/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#1E293B', // slate-800
        'primary-foreground': '#FFFFFF', // white
        
        // Secondary Colors
        'secondary': '#475569', // slate-600
        'secondary-foreground': '#FFFFFF', // white
        
        // Accent Colors
        'accent': '#3B82F6', // blue-500
        'accent-foreground': '#FFFFFF', // white
        
        // Background Colors
        'background': '#FFFFFF', // white
        'surface': '#F8FAFC', // slate-50
        
        // Text Colors
        'text-primary': '#0F172A', // slate-900
        'text-secondary': '#64748B', // slate-500
        
        // Status Colors
        'success': '#10B981', // emerald-500
        'success-foreground': '#FFFFFF', // white
        'warning': '#F59E0B', // amber-500
        'warning-foreground': '#FFFFFF', // white
        'error': '#EF4444', // red-500
        'error-foreground': '#FFFFFF', // white
        
        // Neutral Colors
        'neutral': {
          50: '#F8FAFC', // slate-50
          100: '#F1F5F9', // slate-100
          200: '#E2E8F0', // slate-200
          300: '#CBD5E1', // slate-300
          400: '#94A3B8', // slate-400
          500: '#64748B', // slate-500
          600: '#475569', // slate-600
          700: '#334155', // slate-700
          800: '#1E293B', // slate-800
          900: '#0F172A', // slate-900
        },
        
        // Border Colors
        'border': '#E2E8F0', // slate-200
        'border-muted': '#F1F5F9', // slate-100
      },
      fontFamily: {
        sans: ['Open Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'body': ['Source Sans 3', 'system-ui', 'sans-serif'],
        'caption': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'article': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
      },
      boxShadow: {
        'news-sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'news-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'news-lg': '0 10px 25px rgba(0, 0, 0, 0.15)',
        'news-xl': '0 20px 40px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-out': 'fadeOut 0.2s ease-in',
        'scale-in': 'scaleIn 0.15s ease-out',
        'scale-out': 'scaleOut 0.15s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        'reading': '65ch',
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'header': '1000',
        'dropdown': '1100',
        'overlay': '1200',
        'modal': '1300',
        'tooltip': '1400',
      },
      backdropBlur: {
        'xs': '2px',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    function({ addUtilities, theme }) {
      const darkModeUtilities = {
        '.dark': {
          '--tw-bg-opacity': '1',
          '--tw-text-opacity': '1',
          '--tw-border-opacity': '1',
        },
        '.dark .bg-background': {
          'background-color': '#0F172A', // slate-900
        },
        '.dark .bg-surface': {
          'background-color': '#1E293B', // slate-800
        },
        '.dark .text-primary': {
          'color': '#F8FAFC', // slate-50
        },
        '.dark .text-text-primary': {
          'color': '#F8FAFC', // slate-50
        },
        '.dark .text-text-secondary': {
          'color': '#94A3B8', // slate-400
        },
        '.dark .border-border': {
          'border-color': '#334155', // slate-700
        },
        '.dark .border-border-muted': {
          'border-color': '#1E293B', // slate-800
        },
      };
      addUtilities(darkModeUtilities);
    },
  ],
}
