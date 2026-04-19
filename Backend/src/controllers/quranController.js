// Using CDN URLs from quran-json (https://github.com/risan/quran-json)
const CHAPTERS_LIST_URL = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/en/index.json'
const CHAPTER_URL = (chapterNum, lang = 'en') =>
  `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/${lang}/${chapterNum}.json`

let surahsCache = null
const chapterCache = {}

function normalizeChapterData(data) {
  if (!data) return null

  return {
    chapter: {
      number: data.id,
      name: data.translation || data.transliteration || data.name,
      arabicName: data.name,
      transliteration: data.transliteration,
      translation: data.translation,
      revelation_type: data.type,
      numberOfAyahs: data.total_verses
    },
    ayahs: Array.isArray(data.verses)
      ? data.verses.map((verse) => ({
          number: verse.id,
          text: verse.text,
          translation: verse.translation,
          transliteration: verse.transliteration
        }))
      : []
  }
}

// Fetch and cache surahs list
async function getSurahsList() {
  if (surahsCache) return surahsCache

  try {
    const response = await fetch(CHAPTERS_LIST_URL)
    if (!response.ok) throw new Error(`Failed to fetch chapters: ${response.status}`)
    const data = await response.json()
    surahsCache = data.chapters || data
    console.log(`✅ Loaded ${surahsCache.length} chapters from CDN`)
    return surahsCache
  } catch (error) {
    console.error('Error fetching surahs list:', error)
    throw error
  }
}

// Fetch and cache a specific chapter with verses
async function getChapterVerses(chapterNum, lang = 'en') {
  const cacheKey = `${chapterNum}_${lang}`
  if (chapterCache[cacheKey]) return chapterCache[cacheKey]

  try {
    const url = CHAPTER_URL(chapterNum, lang)
    console.log(`Fetching chapter ${chapterNum} from: ${url}`)
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch chapter: ${response.status}`)
    const data = await response.json()
    const normalized = normalizeChapterData(data)
    chapterCache[cacheKey] = normalized
    console.log(`✅ Loaded chapter ${chapterNum} with ${normalized?.ayahs?.length || 0} ayahs`)
    return normalized
  } catch (error) {
    console.error(`Error fetching chapter ${chapterNum}:`, error)
    throw error
  }
}

export async function getAllSurahs(req, res) {
  try {
    const surahs = await getSurahsList()
    return res.json({ success: true, data: surahs })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}

export async function getSurahById(req, res) {
  try {
    const id = parseInt(req.params.id)

    // Validate surah number (1-114)
    if (id < 1 || id > 114) {
      return res.status(400).json({ success: false, error: 'Invalid surah number (1-114)' })
    }

    // Get chapter with verses and translation
    const chapterData = await getChapterVerses(id, 'en')

    if (!chapterData || !chapterData.chapter) {
      return res.status(404).json({ success: false, error: 'Chapter not found' })
    }

    return res.json({
      success: true,
      data: {
        surah: chapterData.chapter,
        ayahs: chapterData.ayahs || []
      }
    })
  } catch (error) {
    console.error('Error in getSurahById:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}

export async function searchAyahs(req, res) {
  try {
    const query = req.query.q?.toLowerCase()

    if (!query || query.length < 2) {
      return res.json({ success: true, data: [] })
    }

    // For efficient search, we'll need to load all chapters
    const results = []

    // Load up to first 10 chapters for search (can be optimized later)
    for (let i = 1; i <= Math.min(10, 114); i++) {
      try {
        const chapter = await getChapterVerses(i, 'en')
        if (chapter.ayahs) {
          chapter.ayahs
            .filter(ayah => {
              const translation = (ayah.translation || '').toLowerCase()
              const text = (ayah.text || '').toLowerCase()
              return translation.includes(query) || text.includes(query)
            })
            .slice(0, 5) // Limit per chapter
            .forEach(ayah => {
              results.push({
                surahId: chapter.chapter.number,
                surahName: chapter.chapter.name,
                ayahNumber: ayah.number,
                text: ayah.text,
                translation: ayah.translation
              })
            })
        }
      } catch (error) {
        console.error(`Error searching chapter ${i}:`, error)
        continue
      }
    }

    return res.json({ success: true, data: results.slice(0, 50) })
  } catch (error) {
    console.error('Error searching:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
