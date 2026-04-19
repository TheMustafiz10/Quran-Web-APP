'use client';

import { useState } from 'react';

export default function AyahCard({
  verse,
  isHighlighted = false,
}: {
  verse: any;
  isHighlighted?: boolean;
}) {
  const [showTranslation, setShowTranslation] = useState(true);
  const ayahNumber = verse.number || verse.ayahNumber;

  return (
    <div id={`ayah-${ayahNumber}`} className={`ayah-card ${isHighlighted ? 'highlighted' : ''}`}>
      <div className="ayah-header">
        <span className="ayah-number">{ayahNumber}</span>
        <button 
          className="toggle-translation"
          onClick={() => setShowTranslation(!showTranslation)}
          title="Toggle translation"
        >
          {showTranslation ? '📖' : '🔤'}
        </button>
      </div>

      <div className="ayah-content">
        <p className="ayah-text arabic">{verse.text}</p>
        {showTranslation && verse.translation && (
          <p className="ayah-translation">{verse.translation}</p>
        )}
      </div>

      <div className="ayah-footer">
        <button className="ayah-action-button" title="Play audio">
          🔊 Play
        </button>
        <button className="ayah-action-button" title="Share">
          📤 Share
        </button>
        <button className="ayah-action-button" title="Bookmark">
          🔖 Bookmark
        </button>
      </div>
    </div>
  );
}
