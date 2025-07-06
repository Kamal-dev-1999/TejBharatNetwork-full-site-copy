const mongoose = require('mongoose');
const fetch = require('node-fetch');

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

async function testServer() {
  try {
    console.log('Testing server connection...');
    
    // Test 1: Check if server is running
    const testResponse = await fetch('http://localhost:4000/api/test');
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Server is running:', testData.message);
    } else {
      console.log('❌ Server test failed');
      return;
    }
    
    // Test 2: Check if we can fetch articles
    const articlesResponse = await fetch('http://localhost:4000/api/articles2/latest?limit=5');
    if (articlesResponse.ok) {
      const articlesData = await articlesResponse.json();
      console.log('✅ Articles API working');
      console.log('📊 Found', articlesData.articles?.length || 0, 'articles');
      
      if (articlesData.articles && articlesData.articles.length > 0) {
        const firstArticle = articlesData.articles[0];
        console.log('📰 First article ID:', firstArticle._id);
        console.log('📰 First article title:', firstArticle.title);
        
        // Test 3: Try to fetch the first article by ID
        const articleResponse = await fetch(`http://localhost:4000/api/articles/${firstArticle._id}`);
        if (articleResponse.ok) {
          const articleData = await articleResponse.json();
          console.log('✅ Single article API working');
          console.log('📰 Fetched article title:', articleData.article.title);
        } else {
          console.log('❌ Single article API failed:', articleResponse.status);
        }
      } else {
        console.log('⚠️ No articles found in database');
      }
    } else {
      console.log('❌ Articles API failed:', articlesResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFetchArticle();
testServer(); 