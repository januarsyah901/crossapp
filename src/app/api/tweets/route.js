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
    // Dynamically get the authenticated user ID
    const me = await client.v2.me();
    
    if (!me.data?.id) {
      return NextResponse.json({ error: 'Authentication failed: Could not fetch user data' }, { status: 401 });
    }

    const userId = me.data.id;
    const timeline = await client.v2.userTimeline(userId, { 
      'tweet.fields': ['created_at', 'public_metrics'],
      max_results: 10 
    });
    
    return NextResponse.json(timeline.data.data || []);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    
    // Check if it's a 401 error from Twitter API
    if (error.code === 401) {
      return NextResponse.json({ 
        error: 'Unauthorized: Please check your X API keys and permissions.',
        details: 'Ensure your App has "Read and Write" permissions and tokens are valid.'
      }, { status: 401 });
    }
    
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
