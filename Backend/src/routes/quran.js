import express from 'express';
import { 
  getAllSurahs, 
  getSurahById, 
  searchAyahs 
} from '../controllers/quranController.js';

const router = express.Router();

// Get all surahs list
router.get('/surahs', getAllSurahs);

// Get specific surah by ID
router.get('/surahs/:id', getSurahById);

// Search ayahs
router.get('/search', searchAyahs);

export default router;