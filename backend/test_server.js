const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://user1:Nor1oN3bRa7x029f@tejbharatnetwork.i4tftb2.mongodb.net/?retryWrites=true&w=majority&appName=TejBharatNetwork';

async function testFetchArticle() {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'newsdb',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const articleSchema = new mongoose.Schema({}, { collection: 'articles2' });
    const Article = mongoose.model('ArticleTest', articleSchema);

    const article = await Article.findOne();
    if (article) {
      console.log('Fetched article:', article);
    } else {
      console.log('No articles found in articles2 collection.');
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error fetching article:', err);
  }
}

testFetchArticle(); 