import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
];

const GOOGLE_API_KEY = 'AIzaSyCryOwktO78IPFMkfcK7iS_xaI_LgwFdsg';

async function googleTranslateText(text, targetLang) {
  if (!text || !targetLang) {
    console.error('Missing text or targetLang for translation');
    return text;
  }
  // Chunk paragraphs for long articles
  const paragraphs = text.split('\n\n');
  const translatedParagraphs = [];
  for (const para of paragraphs) {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: para,
            source: 'en',
            target: targetLang,
            format: 'text',
          }),
        }
      );
      const data = await response.json();
      if (data && data.data && data.data.translations && data.data.translations[0]) {
        translatedParagraphs.push(data.data.translations[0].translatedText);
      } else {
        translatedParagraphs.push(para);
      }
    } catch (error) {
      translatedParagraphs.push(para);
    }
  }
  return translatedParagraphs.join('\n\n');
}

const ArticleContent = ({ content, readingTime, articleLink }) => {
  const [fontSize, setFontSize] = useState('base');
  const [selectedLang, setSelectedLang] = useState('en');
  const [translatedContent, setTranslatedContent] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleLanguageChange = async (lang) => {
    setSelectedLang(lang);
    if (lang === 'en') {
      setTranslatedContent(null);
      return;
    }
    setIsTranslating(true);
    // Chunk paragraphs for long articles
    const paragraphs = content.split('\n\n');
    const translated = await googleTranslateText(content, lang);
    setTranslatedContent(translated);
    setIsTranslating(false);
  };

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed',
    xl: 'text-xl leading-relaxed',
  };

  // Enhanced paragraph splitting: split at double newlines, or after 2-3 sentences if no double newlines
  const smartSplitParagraphs = (text) => {
    if (text.includes('\n\n')) {
      return text.split(/\n\n+/);
    }
    const sentences = text.match(/[^.!?]+[.!?]+[\s\n]+|[^.!?]+$/g) || [text];
    const paragraphs = [];
    let para = '';
    let count = 0;
    for (let s of sentences) {
      para += s.trim() + ' ';
      count++;
      if (count >= 3) {
        paragraphs.push(para.trim());
        para = '';
        count = 0;
      }
    }
    if (para.trim()) paragraphs.push(para.trim());
    return paragraphs;
  };

  const formatContent = (text) => {
    return smartSplitParagraphs(text).map((paragraph, index) => {
      const isIndianLang = selectedLang === 'hi' || selectedLang === 'mr';
      return (
        <p key={index} className={`mb-8 text-justify ${fontSizeClasses[fontSize]} text-text-primary font-serif`}>
          {paragraph}
        </p>
      );
    });
  };

  return (
    <article className="max-w-none">
      {/* Language Switcher */}
      <div className="flex justify-end mb-4 space-x-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-3 py-1 rounded border text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary
              ${selectedLang === lang.code ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-gray-300 hover:bg-gray-100'}`}
            aria-pressed={selectedLang === lang.code}
            aria-label={`Switch to ${lang.label}`}
          >
            {lang.label}
          </button>
        ))}
      </div>
      {/* Reading Time and Font Controls */}
      <div className="flex items-center justify-between mb-8 p-4 bg-surface rounded-xl shadow">
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Clock" size={16} />
          <span>{readingTime} min read</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary mr-2">Font size:</span>
          <Button
            variant={fontSize === 'sm' ? 'primary' : 'ghost'}
            onClick={() => setFontSize('sm')}
            className="px-2 py-1 text-xs"
            aria-label="Small font size"
            title="Small font size"
          >
            <span className="font-serif" style={{ fontSize: 14 }}>A</span>
          </Button>
          <Button
            variant={fontSize === 'base' ? 'primary' : 'ghost'}
            onClick={() => setFontSize('base')}
            className="px-2 py-1 text-sm"
            aria-label="Normal font size"
            title="Normal font size"
          >
            <span className="font-serif" style={{ fontSize: 16 }}>A</span>
          </Button>
          <Button
            variant={fontSize === 'lg' ? 'primary' : 'ghost'}
            onClick={() => setFontSize('lg')}
            className="px-2 py-1 text-base"
            aria-label="Large font size"
            title="Large font size"
          >
            <span className="font-serif" style={{ fontSize: 18 }}>A</span>
          </Button>
          <Button
            variant={fontSize === 'xl' ? 'primary' : 'ghost'}
            onClick={() => setFontSize('xl')}
            className="px-2 py-1 text-lg"
            aria-label="Extra large font size"
            title="Extra large font size"
          >
            <span className="font-serif" style={{ fontSize: 20 }}>A</span>
          </Button>
        </div>
      </div>

      {/* Article Body */}
      <div className="prose prose-lg max-w-none dark:prose-invert font-serif text-justify leading-relaxed">
        {isTranslating
          ? <span>Translating...</span>
          : formatContent(translatedContent || content)}
      </div>

      {/* Divider */}
      <div className="my-12 border-t border-border" />

      {/* Article Footer */}
      <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-sm text-text-secondary">
          <p>Published on {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Eye" size={16} />
          <span>1,234 views</span>
        </div>
      </div>

      {/* Read Original Article Link */}
      {articleLink && (
        <div className="mt-8 flex justify-end">
          <a
            href={articleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 underline text-sm font-medium transition-colors duration-150"
          >
            Read original article
          </a>
        </div>
      )}
    </article>
  );
};

export default ArticleContent;