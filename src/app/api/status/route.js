import { TwitterApi } from 'twitter-api-v2';
import { NextResponse } from 'next/server';

const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

export async function GET() {
  try {
    // Attempt to get authenticated user info to verify connection
    const user = await client.v2.me();
    
    if (user.data) {
      return NextResponse.json({ 
        connected: true, 
        username: user.data.username,
        name: user.data.name 
      });
    } else {
      return NextResponse.json({ 
        connected: false, 
        error: 'No user data returned' 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Connection check failed:', error);
    
    return NextResponse.json({ 
      connected: false, 
      error: error.code === 401 ? 'Invalid credentials' : (error.message || 'Failed to connect to X'),
      code: error.code
    }, { status: error.code === 401 ? 401 : 500 });
  }
}
