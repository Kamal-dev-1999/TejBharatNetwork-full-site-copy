import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';

const LocalizationSettings = ({ settings, onSettingsChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  ];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    onSettingsChange('localization', {
      ...settings.localization,
      language: languageCode
    });
  };

  return (
    <div className="bg-background border border-border rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-surface transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <Icon name="Globe" size={20} className="text-accent" />
          <div>
            <h3 className="text-lg font-semibold text-primary">{t('localization')}</h3>
            <p className="text-sm text-text-secondary">Language, region, and format preferences</p>
          </div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={20} 
          className={`text-text-secondary transform transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-8">
          {/* Language Selection */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-4">{t('language') || 'Language'}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {languages.map((language) => (
                <label
                  key={language.code}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface cursor-pointer transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="language"
                      value={language.code}
                      checked={settings.localization.language === language.code}
                      onChange={() => handleLanguageChange(language.code)}
                      className="w-4 h-4 text-accent border-border focus:ring-accent/20"
                    />
                    <div>
                      <span className="text-sm text-primary font-medium">{language.name}</span>
                      <p className="text-xs text-text-secondary">{language.nativeName}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalizationSettings;
