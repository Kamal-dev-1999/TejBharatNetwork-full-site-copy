import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ContextualBreadcrumbs from '../../components/ui/ContextualBreadcrumbs';

import UserProfile from './components/userProfile';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useLocation } from "react-router-dom";
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const UserSettings = () => {
  const [settings, setSettings] = useState({
    display: {
      theme: 'light', // Will be updated in useEffect
      fontSize: 'medium',
      layoutDensity: 'comfortable',
      showArticlePreview: true,
      imageQuality: 'high'
    }
    
    
    
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const location = useLocation();
  const { theme, setThemeMode } = useTheme();
  const { t } = useTranslation();

  // Update theme when component mounts
  useEffect(() => {
    if (theme) {
      setSettings(prev => ({
        ...prev,
        display: {
          ...prev.display,
          theme: theme
        }
      }));
    }
  }, [theme]);

  const handleSettingsChange = (section, newSettings) => {
    setSettings(prev => ({
      ...prev,
      [section]: newSettings
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    setIsAutoSaving(true);
    // Simulate API call
    setTimeout(() => {
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      setIsAutoSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

 

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        handleSaveSettings();
      }, 5000); // Auto-save after 5 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [settings, hasUnsavedChanges]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="min-h-screen bg-surface">
      <HeaderNavigation />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ContextualBreadcrumbs />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-primary">{t('settings')}</h1>
                <p className="text-text-secondary mt-2">
                  {t('customize_settings', 'Customize your NewsHub experience and manage your account preferences')}
                </p>
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          <UserProfile />

          {/* Settings Sections */}
          <div className="space-y-6">


            {/* Theme Section */}
            <div>
              <h4 className="text-sm font-semibold text-primary mb-4">Theme</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'light', name: 'Light', icon: 'Sun', description: 'Clean and bright interface' },
                  { id: 'dark', name: 'Dark', icon: 'Moon', description: 'Easy on the eyes' },
                  { id: 'auto', name: 'Auto', icon: 'Monitor', description: 'Follows system preference' }
                ].map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      setThemeMode(themeOption.id);
                      handleSettingsChange('display', { ...settings.display, theme: themeOption.id });
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      theme === themeOption.id
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50 hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon
                        name={themeOption.icon}
                        size={18}
                        className={theme === themeOption.id ? 'text-accent' : 'text-text-secondary'}
                      />
                      <span className={`font-medium ${
                        theme === themeOption.id ? 'text-accent' : 'text-primary'
                      }`}>
                        {themeOption.name}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary">{themeOption.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border text-center text-sm text-text-secondary">
            <p>
              © {new Date().getFullYear()} TejBharatNetwork. All rights reserved. 
              <span className="mx-2">•</span>
              <a href="#" className="text-accent hover:text-accent/80">Privacy Policy</a>
              <span className="mx-2">•</span>
              <a href="#" className="text-accent hover:text-accent/80">Terms of Service</a>
              <span className="mx-2">•</span>
              <a href="#" className="text-accent hover:text-accent/80">Cookie Policy</a>
            </p>
            <p className="mt-2">
              Version 2.1.0 • Last updated: June 25, 2025
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default UserSettings;
