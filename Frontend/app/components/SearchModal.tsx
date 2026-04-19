'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '../hooks/useSearch';

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { results, search, loading } = useSearch();

  const navigateToAyah = (surahId: number, ayahNumber: number) => {
    router.push(`/surah/${surahId}#ayah-${ayahNumber}`);
    onClose();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setHasSearched(true);
    await search(trimmedQuery);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Search Quran</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for verses..."
            value={query}
            onChange={(e) => {
              const nextValue = e.target.value;
              setQuery(nextValue);
              if (!nextValue.trim()) {
                setHasSearched(false);
              }
            }}
            className="search-input"
            autoFocus
          />
          <button type="submit" className="search-submit">Search</button>
        </form>

        {loading && <div className="loading">Searching...</div>}

        <div className="search-results">
          {results.length > 0 ? (
            results.map((result: any, index: number) => (
              <button
                key={index}
                type="button"
                className="search-result-item"
                onClick={() => navigateToAyah(result.surahId, result.ayahNumber)}
              >
                <p className="result-text arabic">{result.text}</p>
                {result.translation && <p className="result-translation">{result.translation}</p>}
                <small className="result-reference">
                  Surah {result.surahId} - {result.surahName} | Ayah {result.ayahNumber}
                </small>
              </button>
            ))
          ) : (
            hasSearched && !loading && <p className="no-results">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}
