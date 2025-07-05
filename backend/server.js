// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
// disable ETag => no conditional GET / 304
app.disable('etag');
app.use(cors());
app.use(express.json());

// 1) Connect to MongoDB (newsdb)
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'newsdb',
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB (newsdb) connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// 2) Article schema + model
const articleSchema = new mongoose.Schema({
  title:       String,
  link:        String,
  summary:     String,
  full_text:   String,
  image_url:   String,
  source:      String,
  category:    String,
  published_dt: Date,
  fetched_at:  { type: Date, default: Date.now },
  article_hash:String,
}, { collection: 'articles2' });

const Article = mongoose.model('Article', articleSchema);

// 3) Your exact categories
const CATEGORIES = [
  "Breaking News",   // ticker
  "Mumbai",          // regional
  "National News",
  "International News",
  "Finance",
  "Aviation",
  "Technology",
  "Sports",
  "Entertainment",
  "Opinion"
];

// no-cache middleware
function noCache(req, res, next) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
}

// -----------------------------------------------------------------------------
// 3a) Paginated per-category
// GET /api/articles?category=Technology&page=1&limit=10
app.get('/api/articles', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    if (!category) return res.status(400).json({ error: 'Missing category' });
    if (!CATEGORIES.includes(category)) 
      return res.status(400).json({ error: 'Invalid category' });

    const filter = { category };
    const total = await Article.countDocuments(filter);
    const docs = await Article.find(filter)
      .sort({ fetched_at: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      page:       parseInt(page),
      limit:      parseInt(limit),
      total,
      totalPages: Math.ceil(total/limit),
      articles:   docs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -----------------------------------------------------------------------------
// 3b) Latest across ALL categories
// GET /api/articles/latest?limit=5
app.get('/api/articles/latest', noCache, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const docs = await Article.find({})
      .sort({ fetched_at: -1 })
      .limit(limit);
    res.json({ articles: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -----------------------------------------------------------------------------
// 3c) Latest IN ONE category
// GET /api/articles/latest/Technology?limit=5
app.get('/api/articles/latest/:category', noCache, async (req, res) => {
  try {
    const { category } = req.params;
    if (!CATEGORIES.includes(category)) 
      return res.status(400).json({ error: 'Invalid category' });

    const limit = parseInt(req.query.limit) || 5;
    const docs = await Article.find({ category })
      .sort({ fetched_at: -1 })
      .limit(limit);
    res.json({ articles: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -----------------------------------------------------------------------------
// 3d) Grouped latest per category
// GET /api/articles/grouped?limit=4
app.get('/api/articles/grouped', noCache, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const result = {};
    await Promise.all(CATEGORIES.map(async cat => {
      result[cat] = await Article.find({ category: cat })
        .sort({ fetched_at: -1 })
        .limit(limit);
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -----------------------------------------------------------------------------
// 4) Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// GET /api/articles2/latest?limit=20
app.get('/api/articles2/latest', noCache, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const docs = await Article.find({})
      .sort({ fetched_at: -1 })
      .limit(limit);
    res.json({ articles: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
