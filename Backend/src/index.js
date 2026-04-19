import express from 'express';
import quranRoutes from './routes/quran.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS for browser access (if needed)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Routes
app.use('/api/quran', quranRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Quran API',
    version: '1.0.0',
    endpoints: {
      'GET /api/quran/surahs': 'Get all surahs',
      'GET /api/quran/surahs/:id': 'Get specific surah with verses',
      'GET /api/quran/search?q=keyword': 'Search ayahs by keyword',
      'GET /health': 'Health check'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Quran API endpoints:`);
    console.log(`  - GET http://localhost:${PORT}/api/quran/surahs`);
    console.log(`  - GET http://localhost:${PORT}/api/quran/surahs/1`);
    console.log(`  - GET http://localhost:${PORT}/api/quran/search?q=mercy`);
  });
}

export default app;