import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ContextualBreadcrumbs from '../../components/ui/ContextualBreadcrumbs';
import LocalizationSettings from './components/LocalizationSettings';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const UserSettings = () => {
  const [settings, setSettings] = useState({
    display: {
      theme: 'light',
      fontSize: 'medium',
      layoutDensity: 'comfortable',
      showArticlePreview: true,
      imageQuality: 'high'
    },
    notifications: {
      breakingNews: true,
      dailyDigest: true,
      categoryUpdates: false,
      bookmarkReminders: true,
      deliveryTime: 'immediate',
      subscribedCategories: ['Technology', 'Politics', 'Business'],
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '08:00'
      }
    },
    privacy: {
      analytics: true,
      personalization: true,
      locationData: false,
      socialSharing: true,
      cookies: {
        essential: true,
        analytics: true,
        marketing: false,
        preferences: true
      },
      dataRetention: '1year'
    },
    account: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'News enthusiast and technology professional',
      subscription: 'free'
    },
    localization: {
      language: 'en',
      timezone: 'UTC-5',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      region: 'us',
      showLocalNews: true
    }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [isAutoSaving, setIsAutoSaving] = useState(false);

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

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      setSettings({
        display: {
          theme: 'light',
          fontSize: 'medium',
          layoutDensity: 'comfortable',
          showArticlePreview: true,
          imageQuality: 'high'
        },
        notifications: {
          breakingNews: true,
          dailyDigest: true,
          categoryUpdates: false,
          bookmarkReminders: true,
          deliveryTime: 'immediate',
          subscribedCategories: [],
          quietHours: {
            enabled: false,
            startTime: '22:00',
            endTime: '08:00'
          }
        },
        privacy: {
          analytics: false,
          personalization: false,
          locationData: false,
          socialSharing: false,
          cookies: {
            essential: true,
            analytics: false,
            marketing: false,
            preferences: false
          },
          dataRetention: '30days'
        },
        account: {
          name: '',
          email: '',
          bio: '',
          subscription: 'free'
        },
        localization: {
          language: 'en',
          timezone: 'UTC+0',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          region: 'us',
          showLocalNews: false
        }
      });
      setHasUnsavedChanges(true);
    }
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
                <h1 className="text-3xl font-bold text-primary">Settings</h1>
                <p className="text-text-secondary mt-2">
                  Customize your NewsHub experience and manage your account preferences
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleResetSettings}
                  iconName="RotateCcw"
                >
                  Reset All
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveSettings}
                  disabled={!hasUnsavedChanges || isAutoSaving}
                  iconName={isAutoSaving ? "Loader2" : "Save"}
                  className={isAutoSaving ? "animate-spin" : ""}
                >
                  {isAutoSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            <LocalizationSettings 
              settings={settings} 
              onSettingsChange={handleSettingsChange} 
            />

            {/* Theme Section */}
            <div>
              <h4 className="text-sm font-semibold text-primary mb-4">Theme</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'light', name: 'Light', icon: 'Sun', description: 'Clean and bright interface' },
                  { id: 'dark', name: 'Dark', icon: 'Moon', description: 'Easy on the eyes' },
                  { id: 'auto', name: 'Auto', icon: 'Monitor', description: 'Follows system preference' }
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleSettingsChange('display', { ...settings.display, theme: theme.id })}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      settings.display.theme === theme.id
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50 hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon
                        name={theme.icon}
                        size={18}
                        className={settings.display.theme === theme.id ? 'text-accent' : 'text-text-secondary'}
                      />
                      <span className={`font-medium ${
                        settings.display.theme === theme.id ? 'text-accent' : 'text-primary'
                      }`}>
                        {theme.name}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary">{theme.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border text-center text-sm text-text-secondary">
            <p>
              © {new Date().getFullYear()} NewsHub. All rights reserved. 
              <span className="mx-2">•</span>
              <a href="#" className="text-accent hover:text-accent/80">Privacy Policy</a>
              <span className="mx-2">•</span>
              <a href="#" className="text-accent hover:text-accent/80">Terms of Service</a>
              <span className="mx-2">•</span>
              <a href="#" className="text-accent hover:text-accent/80">Cookie Policy</a>
            </p>
            <p className="mt-2">
              Version 2.1.0 • Last updated: March 15, 2024
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default UserSettings;
