/**
 * NEXX Enrichment Engine Ticker v1.0
 * Shows recent auto-enrichment activity in a subtle bottom bar
 */
(function() {
  'use strict';

  const FEED_URL = '/api/enrichment/feed';
  const POLL_INTERVAL = 300000; // 5 min
  let tickerContainer = null;
  let tickerInterval = null;

  async function fetchFeed() {
    try {
      const res = await fetch(FEED_URL);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function createTicker(feed) {
    if (!feed || !feed.ticker || feed.ticker.length === 0) return;

    // Remove existing ticker
    if (tickerContainer) {
      tickerContainer.remove();
    }

    tickerContainer = document.createElement('div');
    tickerContainer.id = 'enrichment-ticker';
    tickerContainer.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to right, #0f172a, #1e293b);
      color: #94a3b8;
      font-size: 12px;
      padding: 6px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 30;
      border-top: 1px solid #334155;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `;

    // Status indicator
    const statusDot = document.createElement('span');
    statusDot.style.cssText = `
      width: 6px; height: 6px; border-radius: 50%;
      background: ${feed.active ? '#10b981' : '#f59e0b'};
      flex-shrink: 0;
      ${feed.active ? 'animation: pulse-dot 2s ease-in-out infinite;' : ''}
    `;
    tickerContainer.appendChild(statusDot);

    // Label
    const label = document.createElement('span');
    label.textContent = 'ENGINE';
    label.style.cssText = 'font-weight: 700; color: #e2e8f0; flex-shrink: 0; letter-spacing: 0.05em; font-size: 11px;';
    tickerContainer.appendChild(label);

    // Separator
    const sep = document.createElement('span');
    sep.textContent = '|';
    sep.style.cssText = 'color: #475569; flex-shrink: 0;';
    tickerContainer.appendChild(sep);

    // Scrolling ticker
    const tickerTrack = document.createElement('div');
    tickerTrack.style.cssText = `
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
    `;

    const tickerContent = document.createElement('div');
    tickerContent.style.cssText = `
      display: inline-block;
      animation: ticker-scroll ${Math.max(20, feed.ticker.length * 4)}s linear infinite;
    `;

    feed.ticker.forEach((item, i) => {
      const span = document.createElement('span');
      span.style.cssText = 'margin-right: 24px;';
      span.textContent = `${item.icon} ${item.text}`;
      tickerContent.appendChild(span);
    });

    // Duplicate for seamless loop
    feed.ticker.forEach((item) => {
      const span = document.createElement('span');
      span.style.cssText = 'margin-right: 24px;';
      span.textContent = `${item.icon} ${item.text}`;
      tickerContent.appendChild(span);
    });

    tickerTrack.appendChild(tickerContent);
    tickerContainer.appendChild(tickerTrack);

    // Stats
    if (feed.totalChanges > 0) {
      const stats = document.createElement('span');
      stats.style.cssText = 'flex-shrink: 0; color: #64748b; font-size: 10px;';
      stats.textContent = `${feed.totalChanges} changes`;
      tickerContainer.appendChild(stats);
    }

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      flex-shrink: 0; background: none; border: none; color: #64748b;
      cursor: pointer; font-size: 16px; padding: 0 4px; line-height: 1;
    `;
    closeBtn.onclick = () => {
      tickerContainer.remove();
      tickerContainer = null;
      if (tickerInterval) clearInterval(tickerInterval);
    };
    tickerContainer.appendChild(closeBtn);

    document.body.appendChild(tickerContainer);
  }

  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ticker-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);

  // Init
  async function init() {
    // Only show if authenticated
    if (localStorage.getItem('nexx_auth') !== 'true') return;

    const feed = await fetchFeed();
    if (feed) createTicker(feed);

    // Poll for updates
    tickerInterval = setInterval(async () => {
      const newFeed = await fetchFeed();
      if (newFeed) createTicker(newFeed);
    }, POLL_INTERVAL);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 2000); // Delay to not compete with main app load
  }
})();
