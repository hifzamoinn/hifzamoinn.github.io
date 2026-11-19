/* Initialize Hifza's tracker only when the separate Cloudflare Worker is configured. */
(()=>{const endpoint=String(window.HIFZA_INSIGHTS_ENDPOINT||'').replace(/\/$/,'');if(!/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(endpoint))return;const s=document.createElement('script');s.src='/portfolio-insights/tracker.js';s.dataset.endpoint=endpoint;s.async=true;document.head.appendChild(s);})();
