'use client';

import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SurahCard from './components/SurahCard';
import { fetchChapters } from './utils/api';

export default function Home() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const data = await fetchChapters();
        setChapters(data);
      } catch (error) {
        console.error('Failed to load chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChapters();
  }, []);

  return (
    <Layout>
      <div className="home-container">
        <header className="home-header">
          <h1>Holy Quran</h1>
        </header>

        {loading ? (
          <div className="loading">Loading chapters...</div>
        ) : (
          <div className="chapters-grid">
            {chapters.map((chapter: any) => (
              <SurahCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
