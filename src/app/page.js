'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [tweetText, setTweetText] = useState('');
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const fetchTweets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tweets');
      const data = await response.json();
      if (Array.isArray(data)) {
        setTweets(data);
      } else {
        setTweets([]);
      }
    } catch (err) {
      console.error('Failed to fetch tweets:', err);
      showToast('Failed to load tweets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const handlePostTweet = async () => {
    if (!tweetText.trim()) return;

    setPosting(true);
    try {
      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: tweetText }),
      });

      if (response.ok) {
        showToast('Tweet posted successfully! ✨');
        setTweetText('');
        fetchTweets();
      } else {
        const data = await response.json();
        showToast(`Error: ${data.error || 'Something went wrong'}`);
      }
    } catch (err) {
      showToast('Connection error. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="glass-bg"></div>
      <main className="container">
        <header>
          <div className="logo">
            <svg className="twitter-icon" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
            <h1>Simple X</h1>
          </div>
          <p className="subtitle">Connect. Share. Post.</p>
        </header>

        <section className="card">
          <textarea
            placeholder="What's happening?"
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            maxLength={280}
          ></textarea>
          <div className="card-footer">
            <span id="char-count" style={{ color: tweetText.length > 280 ? '#f4212e' : '' }}>
              {tweetText.length}/280
            </span>
            <button
              className="primary-btn"
              onClick={handlePostTweet}
              disabled={posting || !tweetText.trim() || tweetText.length > 280}
            >
              {posting ? 'Posting...' : 'Tweet'}
            </button>
          </div>
        </section>

        <section className="feed">
          <div className="feed-header">
            <h2>Your Timeline</h2>
            <button className="secondary-btn" onClick={fetchTweets} disabled={loading}>
              <svg className="refresh-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm3.536-11.536l-1.414 1.414C13.586 7.35 12.818 7 12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5c1.378 0 2.628-.561 3.536-1.464l1.414 1.414C15.65 18.25 13.918 19 12 19c-3.859 0-7-3.141-7-7s3.141-7 7-7c1.141 0 2.223.273 3.182.757l.354-.354V8.536z"></path>
              </svg>
              Refresh
            </button>
          </div>

          <div className="tweet-list">
            {loading ? (
              <div className="loader">Refreshing feed...</div>
            ) : tweets.length === 0 ? (
              <div className="loader">No tweets found in your timeline.</div>
            ) : (
              tweets.map((tweet, index) => (
                <div
                  key={tweet.id || index}
                  className="tweet-item"
                  style={{ opacity: 1, animationDelay: `${index * 0.1}s` }}
                >
                  <div className="tweet-text">{tweet.text}</div>
                  <div className="tweet-meta">
                    <span>{formatDate(tweet.created_at)}</span>
                    <span>💬 {tweet.public_metrics?.reply_count || 0}</span>
                    <span>🔄 {tweet.public_metrics?.retweet_count || 0}</span>
                    <span>❤️ {tweet.public_metrics?.like_count || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <footer>
          <p>© 2026 Simple X - Built with Next.js</p>
        </footer>

        <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
      </main>
    </>
  );
}
