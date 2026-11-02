(() => {
  'use strict';

  const STORAGE_KEY = 'yt_premium_welcome_seen_v1';
  const GITHUB_URL = 'https://github.com/Shresthzzzz/youtube-premium-for-free-';

  if (localStorage.getItem(STORAGE_KEY)) {
    return;
  }

  function renderModal() {
    if (document.getElementById('yt-premium-welcome-modal')) return;

    const modalContainer = document.createElement('div');
    modalContainer.id = 'yt-premium-welcome-modal';

    modalContainer.innerHTML = `
      <style>
        #yt-premium-welcome-modal {
          position: fixed;
          inset: 0;
          z-index: 9999999999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.82);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-family: "Roboto", "YouTube Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          animation: ytFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes ytFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes ytFadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.96); }
        }

        .yt-prem-card {
          width: 90%;
          max-width: 520px;
          background: #0f0f0f;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 0, 0, 0.15);
          overflow: hidden;
          color: #f1f1f1;
          display: flex;
          flex-direction: column;
        }

        .yt-prem-header {
          padding: 24px 28px 16px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, rgba(255, 0, 0, 0.08) 0%, rgba(15, 15, 15, 0) 100%);
        }

        .yt-prem-badge-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .yt-prem-play-icon {
          width: 32px;
          height: 24px;
          background: #ff0000;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 12px rgba(255, 0, 0, 0.5);
        }

        .yt-prem-play-icon svg {
          fill: #ffffff;
          width: 12px;
          height: 12px;
        }

        .yt-prem-title {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.3px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ffffff;
        }

        .yt-prem-tag {
          font-size: 11px;
          font-weight: 600;
          color: #ff4e4e;
          background: rgba(255, 0, 0, 0.12);
          padding: 2px 7px;
          border-radius: 4px;
          border: 1px solid rgba(255, 0, 0, 0.3);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .yt-prem-close-btn {
          background: none;
          border: none;
          color: #aaa;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
        }

        .yt-prem-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .yt-prem-body {
          padding: 22px 28px;
        }

        .yt-prem-creator-callout {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 13.5px;
          color: #ccc;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .yt-prem-creator-name {
          color: #ffffff;
          font-weight: 600;
        }

        .yt-prem-features-title {
          font-size: 13px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          margin-bottom: 12px;
        }

        .yt-prem-feature-list {
          display: flex;
          flex-direction: column;
          gap: 11px;
          margin-bottom: 24px;
        }

        .yt-prem-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 13.5px;
          line-height: 1.45;
          color: #ddd;
        }

        .yt-prem-check {
          color: #ff3b30;
          font-size: 15px;
          margin-top: 1px;
          flex-shrink: 0;
        }

        .yt-prem-feature-text strong {
          color: #fff;
        }

        .yt-prem-actions {
          display: flex;
          gap: 12px;
          padding-top: 6px;
        }

        .yt-prem-btn {
          flex: 1;
          padding: 12px 18px;
          border-radius: 24px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          text-decoration: none;
          box-sizing: border-box;
        }

        .yt-prem-btn-source {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.16);
        }

        .yt-prem-btn-source:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        .yt-prem-btn-continue {
          background: #ff0000;
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(255, 0, 0, 0.35);
        }

        .yt-prem-btn-continue:hover {
          background: #d90000;
          box-shadow: 0 6px 20px rgba(255, 0, 0, 0.5);
          transform: translateY(-1px);
        }
      </style>

      <div class="yt-prem-card">
        <div class="yt-prem-header">
          <div class="yt-prem-badge-group">
            <div class="yt-prem-play-icon">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div class="yt-prem-title">
              YouTube Premium
              <span class="yt-prem-tag">Active</span>
            </div>
          </div>
          <button class="yt-prem-close-btn" id="yt-prem-btn-x" title="Close">&times;</button>
        </div>

        <div class="yt-prem-body">
          <div class="yt-prem-creator-callout">
            <span>Created by <span class="yt-prem-creator-name">Shresth</span></span>
            <span style="color: #ff4e4e; font-weight: 500;">v1.2</span>
          </div>

          <div class="yt-prem-features-title">Features Enabled</div>

          <div class="yt-prem-feature-list">
            <div class="yt-prem-feature-item">
              <span class="yt-prem-check">&#10003;</span>
              <div class="yt-prem-feature-text"><strong>Zero-Ad Experience:</strong> Network & payload-level ad eradication (uBlock Origin style) — no video ads, no delays.</div>
            </div>
            <div class="yt-prem-feature-item">
              <span class="yt-prem-check">&#10003;</span>
              <div class="yt-prem-feature-text"><strong>Anti-Adblock Bypass:</strong> Automatically neutralizes YouTube's ad-block detection and warning popups.</div>
            </div>
            <div class="yt-prem-feature-item">
              <span class="yt-prem-check">&#10003;</span>
              <div class="yt-prem-feature-text"><strong>Cosmetic Clean:</strong> Removes homepage masthead ads, sponsor cards, and sidebar promo clutter.</div>
            </div>
            <div class="yt-prem-feature-item">
              <span class="yt-prem-check">&#10003;</span>
              <div class="yt-prem-feature-text"><strong>Premium Badge:</strong> Authentic YouTube Premium logo on desktop and mobile web headers.</div>
            </div>
            <div class="yt-prem-feature-item">
              <span class="yt-prem-check">&#10003;</span>
              <div class="yt-prem-feature-text"><strong>3.0x Playback Speed:</strong> Toggle high-speed playback anytime via the 3.0 button or <code>Alt + 3</code>.</div>
            </div>
          </div>

          <div class="yt-prem-actions">
            <a class="yt-prem-btn yt-prem-btn-source" id="yt-prem-btn-source" href="${GITHUB_URL}" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Source Code
            </a>
            <button class="yt-prem-btn yt-prem-btn-continue" id="yt-prem-btn-continue">
              Continue to YouTube
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalContainer);

    function dismissModal() {
      localStorage.setItem(STORAGE_KEY, 'true');
      modalContainer.style.animation = 'ytFadeOut 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => {
        modalContainer.remove();
      }, 250);
    }

    document.getElementById('yt-prem-btn-continue').addEventListener('click', dismissModal);
    document.getElementById('yt-prem-btn-x').addEventListener('click', dismissModal);

    document.getElementById('yt-prem-btn-source').addEventListener('click', () => {
      dismissModal();
    });

    // Dismiss when clicking outside modal card
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        dismissModal();
      }
    });
  }

  if (document.body) {
    renderModal();
  } else {
    window.addEventListener('DOMContentLoaded', renderModal, { once: true });
  }
})();
