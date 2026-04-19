'use client';

import Link from 'next/link';

export default function SurahCard({ chapter }: { chapter: any }) {
  return (
    <Link href={`/surah/${chapter.id}`} className="surah-card-link">
      <div className="surah-card">
        <div className="surah-card-header">
          <div className="surah-number">{chapter.id}</div>
          <div className="surah-info-box">
            <h3 className="surah-name">{chapter.transliteration || chapter.translation || chapter.name}</h3>
            <p className="surah-ayah-count">{chapter.total_verses ?? chapter.numberOfAyahs} verses</p>
          </div>
        </div>
        <div className="surah-card-footer">
          <span className="surah-type">
            {(chapter.revelation_type || chapter.type || '').toLowerCase() === 'meccan' ? 'Meccan' : 'Medinan'}
          </span>
          <span className="surah-arabic">{chapter.name}</span>
        </div>
      </div>
    </Link>
  );
}
