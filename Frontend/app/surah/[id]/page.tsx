'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Layout from '@/app/components/Layout';
import AyahCard from '@/app/components/AyahCard';
import { fetchChapterVerses } from '@/app/utils/api';

type Chapter = {
  arabicName?: string;
  name?: string;
  numberOfAyahs?: number;
  revelation_type?: string;
};

type Verse = {
  ayahNumber?: number;
  number?: number;
  text?: string;
  translation?: string;
};

export default function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  const getHashAyahNumber = () => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash;
    if (!hash.startsWith('#ayah-')) return null;

    const parsed = Number(hash.replace('#ayah-', ''));
    return Number.isNaN(parsed) ? null : parsed;
  };

  const targetAyah = getHashAyahNumber();

  useEffect(() => {
    const loadVerses = async () => {
      try {
        const data = await fetchChapterVerses(id);
        setChapter(data.surah as Chapter);
        setVerses((data.ayahs || []) as Verse[]);
      } catch (error) {
        console.error('Failed to load verses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVerses();
  }, [id]);

  useEffect(() => {
    if (loading || targetAyah === null) return;

    const anchorId = `ayah-${targetAyah}`;
    const timer = window.setTimeout(() => {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);

    return () => window.clearTimeout(timer);
  }, [loading, targetAyah, verses]);

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading surah...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="surah-container">
        {chapter && (
          <header className="surah-header">
            <h1 className="surah-header-arabic">{chapter.arabicName || chapter.name}</h1>
            <p className="surah-header-english">{chapter.name}</p>
            <p className="surah-info">
              Verses: {chapter.numberOfAyahs} | {String(chapter.revelation_type || '').toLowerCase() === 'meccan' ? 'Meccan' : 'Medinan'}
            </p>
          </header>
        )}

        <div className="verses-container">
          {verses && verses.length > 0 ? (
            verses.map((verse) => (
              <AyahCard
                key={verse.ayahNumber || verse.number}
                verse={verse}
                isHighlighted={targetAyah !== null && targetAyah === (verse.ayahNumber || verse.number)}
              />
            ))
          ) : (
            <p className="no-verses">No verses found</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
