const translate = require('google-translate-api');

async function translateText(text, targetLang) {
  try {
    const res = await translate(text, { to: targetLang });
    return res.text;
  } catch (err) {
    console.error('Translation error:', err);
    return text;
  }
}

// Example usage:
translateText('Hello world', 'hi').then(console.log); // Output: "नमस्ते दुनिया"
