import { TwitterApi } from 'twitter-api-v2';
import { NextResponse } from 'next/server';

// Initialize Twitter Client
const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

export async function GET() {
  try {
    // We'll fetch the current user's timeline
    // Note: process.env.TWITTER_ACCESS_TOKEN.split('-')[0] is a common way to get user ID for v2
    const userId = process.env.TWITTER_ACCESS_TOKEN?.split('-')[0];
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in environment' }, { status: 500 });
    }

    const timeline = await client.v2.userTimeline(userId, { 
      'tweet.fields': ['created_at', 'public_metrics'],
      max_results: 10 
    });
    
    return NextResponse.json(timeline.data.data || []);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json({ error: 'Failed to fetch tweets' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Tweet text is required' }, { status: 400 });
    }

    const tweet = await client.v2.tweet(text);
    return NextResponse.json({ success: true, tweet: tweet.data });
  } catch (error) {
    console.error('Error creating tweet:', error);
    return NextResponse.json({ error: 'Failed to create tweet' }, { status: 500 });
  }
}
