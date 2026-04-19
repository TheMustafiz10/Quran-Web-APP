const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function normalizeApiBaseUrl(url: string) {
  const trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
}

const API_BASE_URL = normalizeApiBaseUrl(RAW_API_URL);
const FALLBACK_LOCAL_API_URL = 'http://localhost:8080/api';

function getApiBaseUrl() {
  // Use localhost fallback only in development.
  if (API_BASE_URL) return API_BASE_URL;
  if (process.env.NODE_ENV !== 'production') return FALLBACK_LOCAL_API_URL;
  throw new Error('NEXT_PUBLIC_API_URL is missing in production environment');
}

const RESOLVED_API_BASE_URL = getApiBaseUrl();
const BACKEND_BASE_URL = RESOLVED_API_BASE_URL.replace(/\/api$/i, '');

/**
 * Fetch all Quran chapters
 */
export async function fetchChapters() {
  try {
    const response = await fetch(`${RESOLVED_API_BASE_URL}/quran/surahs`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }
}

/**
 * Fetch verses for a specific chapter
 * @param {number} chapterId - The chapter ID
 */
export async function fetchChapterVerses(chapterId: string) {
  try {
    const response = await fetch(`${RESOLVED_API_BASE_URL}/quran/surahs/${chapterId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data || {};
  } catch (error) {
    console.error('Error fetching chapter verses:', error);
    throw error;
  }
}

/**
 * Search Quran by query string
 * @param {string} query - Search query
 */
export async function searchQuran(query: string) {
  try {
    const params = new URLSearchParams({ q: query });
    const response = await fetch(`${RESOLVED_API_BASE_URL}/quran/search?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching Quran:', error);
    throw error;
  }
}

/**
 * Search Quran with POST method
 * @param {string} query - Search query
 * @param {Object} options - Search options
 */
export async function searchQuranAdvanced(query: string, options: any = {}) {
  try {
    const response = await fetch(`${RESOLVED_API_BASE_URL}/quran/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        limit: options.limit || 10,
        ...options
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error in advanced search:', error);
    throw error;
  }
}

/**
 * Get a specific verse by surah and ayah number
 * @param {number} surah - Surah number
 * @param {number} ayah - Ayah number
 */
export async function getVerse(surah: number, ayah: number) {
  try {
    const response = await fetch(`${RESOLVED_API_BASE_URL}/quran/verse/${surah}/${ayah}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching verse:', error);
    throw error;
  }
}

/**
 * Health check to verify API is running
 */
export async function healthCheck() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`API health check failed: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API health check failed:', error);
    return null;
  }
}

