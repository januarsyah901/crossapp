const tweetInput = document.getElementById('tweet-input');
const tweetBtn = document.getElementById('tweet-btn');
const charCount = document.getElementById('char-count');
const refreshBtn = document.getElementById('refresh-btn');
const tweetList = document.getElementById('tweet-list');
const toast = document.getElementById('toast');

// Character counter
tweetInput.addEventListener('input', () => {
    const len = tweetInput.value.length;
    charCount.textContent = `${len}/280`;
    if (len > 280) {
        charCount.style.color = '#f4212e';
        tweetBtn.disabled = true;
    } else {
        charCount.style.color = '';
        tweetBtn.disabled = len === 0;
    }
});

// Post tweet
tweetBtn.addEventListener('click', async () => {
    const text = tweetInput.value.trim();
    if (!text) return;

    tweetBtn.disabled = true;
    tweetBtn.textContent = 'Posting...';

    try {
        const response = await fetch('/api/tweets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (response.ok) {
            showToast('Tweet posted successfully! ✨');
            tweetInput.value = '';
            charCount.textContent = '0/280';
            fetchTweets();
        } else {
            const data = await response.json();
            showToast(`Error: ${data.error || 'Something went wrong'}`);
        }
    } catch (err) {
        showToast('Connection error. Please try again.');
    } finally {
        tweetBtn.disabled = false;
        tweetBtn.textContent = 'Tweet';
    }
});

// Fetch tweets
async function fetchTweets() {
    tweetList.innerHTML = '<div class="loader">Refreshing feed...</div>';
    
    try {
        const response = await fetch('/api/tweets');
        const tweets = await response.json();

        if (tweets.length === 0) {
            tweetList.innerHTML = '<div class="loader">No tweets found in your timeline.</div>';
            return;
        }

        tweetList.innerHTML = '';
        tweets.forEach((tweet, index) => {
            const date = new Date(tweet.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            
            const div = document.createElement('div');
            div.className = 'tweet-item';
            div.style.animationDelay = `${index * 0.1}s`;
            div.innerHTML = `
                <div class="tweet-text">${tweet.text}</div>
                <div class="tweet-meta">
                    <span>${date}</span>
                    <span>💬 ${tweet.public_metrics.reply_count}</span>
                    <span>🔄 ${tweet.public_metrics.retweet_count}</span>
                    <span>❤️ ${tweet.public_metrics.like_count}</span>
                </div>
            `;
            tweetList.appendChild(div);
        });
    } catch (err) {
        tweetList.innerHTML = '<div class="loader">Failed to load tweets. Check server logs.</div>';
    }
}

// Toast helper
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initial load
refreshBtn.addEventListener('click', fetchTweets);
fetchTweets();
