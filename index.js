require('dotenv').config();
const express = require('express');
const { TwitterApi } = require('twitter-api-v2');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Twitter Client
const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes
// Read latest tweets from authenticated user's timeline
app.get('/api/tweets', async (req, res) => {
  try {
    // We'll fetch the current user's timeline
    const timeline = await client.v2.userTimeline(process.env.TWITTER_ACCESS_TOKEN.split('-')[0], { 
      'tweet.fields': ['created_at', 'public_metrics'],
      max_results: 10 
    });
    res.json(timeline.data.data || []);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
});

// Create a new tweet
app.post('/api/tweets', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Tweet text is required' });
  }

  try {
    const tweet = await client.v2.tweet(text);
    res.json({ success: true, tweet: tweet.data });
  } catch (error) {
    console.error('Error creating tweet:', error);
    res.status(500).json({ error: 'Failed to create tweet' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
