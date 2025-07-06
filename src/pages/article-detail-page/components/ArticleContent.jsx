import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ArticleContent = ({ content, readingTime, articleLink }) => {
  const [fontSize, setFontSize] = useState('base');

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed',
    xl: 'text-xl leading-relaxed'
  };

  const adjustFontSize = (size) => {
    setFontSize(size);
  };

  // Enhanced paragraph splitting: split at double newlines, or after 2-3 sentences if no double newlines
  const smartSplitParagraphs = (text) => {
    // If there are double newlines, use them
    if (text.includes('\n\n')) {
      return text.split(/\n\n+/);
    }
    // Otherwise, split after 2-3 sentences
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
    return smartSplitParagraphs(text).map((paragraph, index) => (
      <p key={index} className={`mb-8 text-justify ${fontSizeClasses[fontSize]} text-text-primary font-serif`}>
        {paragraph}
      </p>
    ));
  };

  return (
    <article className="max-w-none">
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
            onClick={() => adjustFontSize('sm')}
            className="px-2 py-1 text-xs"
            aria-label="Small font size"
            title="Small font size"
          >
            <span className="font-serif" style={{ fontSize: 14 }}>A</span>
          </Button>
          <Button
            variant={fontSize === 'base' ? 'primary' : 'ghost'}
            onClick={() => adjustFontSize('base')}
            className="px-2 py-1 text-sm"
            aria-label="Normal font size"
            title="Normal font size"
          >
            <span className="font-serif" style={{ fontSize: 16 }}>A</span>
          </Button>
          <Button
            variant={fontSize === 'lg' ? 'primary' : 'ghost'}
            onClick={() => adjustFontSize('lg')}
            className="px-2 py-1 text-base"
            aria-label="Large font size"
            title="Large font size"
          >
            <span className="font-serif" style={{ fontSize: 18 }}>A</span>
          </Button>
          <Button
            variant={fontSize === 'xl' ? 'primary' : 'ghost'}
            onClick={() => adjustFontSize('xl')}
            className="px-2 py-1 text-lg"
            aria-label="Extra large font size"
            title="Extra large font size"
          >
            <span className="font-serif" style={{ fontSize: 20 }}>A</span>
          </Button>
        </div>
      </div>

      {/* Article Body */}
      <div className="prose prose-slate max-w-none dark:prose-invert font-serif">
        {formatContent(content)}
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