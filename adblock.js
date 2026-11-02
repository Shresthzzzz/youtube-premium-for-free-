(() => {
  'use strict';

  // Fallback: inject script directly into DOM at document_start
  try {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  } catch (_) {}

  let originalPlaybackRate = 1;
  let isHandlingAd = false;

  const SKIP_SELECTORS = [
    '.ytp-skip-ad-button',
    '.ytp-ad-skip-button',
    '.ytp-ad-skip-button-modern',
    '.ytp-ad-skip-button-text',
    '.ytp-ad-overlay-close-button',
    'button.ytp-ad-skip-button-modern',
    '.ytp-ad-skip-button-container button'
  ];

  function clickSkipButtons() {
    for (const selector of SKIP_SELECTORS) {
      const buttons = document.querySelectorAll(selector);
      for (let i = 0; i < buttons.length; i++) {
        try {
          buttons[i].click();
        } catch (_) {}
      }
    }
  }

  function handleVideoAds() {
    const player = document.querySelector('.html5-video-player, #movie_player');
    const video = document.querySelector('video.html5-main-video, video');

    if (!video) return;

    const isAdPlaying = player && (
      player.classList.contains('ad-showing') ||
      player.classList.contains('ad-interrupting') ||
      document.querySelector('.ytp-ad-player-overlay') !== null
    );

    if (isAdPlaying) {
      if (!isHandlingAd) {
        originalPlaybackRate = video.playbackRate > 0 && video.playbackRate <= 4 ? video.playbackRate : 1;
        isHandlingAd = true;
      }

      // 1. Instantly mute audio so nothing leaks
      video.muted = true;

      // 2. Set extreme playback rate
      video.playbackRate = 16.0;

      // 3. Immediately seek to the very end to end the ad stream instantly
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = video.duration + 1;
      }

      // 4. Fire click event on any available skip triggers
      clickSkipButtons();
    } else {
      if (isHandlingAd) {
        isHandlingAd = false;
        video.playbackRate = originalPlaybackRate;
        video.muted = false;
      }
    }
  }

  function bypassAntiAdblockDialog() {
    const enforcement = document.querySelector('ytd-enforcement-message-view-model');
    const dialogs = document.querySelectorAll('tp-yt-paper-dialog');

    let dismissed = false;

    if (enforcement) {
      const parentDialog = enforcement.closest('tp-yt-paper-dialog') || enforcement;
      parentDialog.remove();
      dismissed = true;
    }

    dialogs.forEach(dialog => {
      const text = dialog.textContent || '';
      if (text.includes('Ad blockers violate YouTube') || text.includes('Ad blockers are not allowed')) {
        dialog.remove();
        dismissed = true;
      }
    });

    if (dismissed) {
      const backdrops = document.querySelectorAll('tp-yt-iron-overlay-backdrop');
      backdrops.forEach(b => b.remove());

      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';

      const video = document.querySelector('video');
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    }
  }

  function monitor() {
    handleVideoAds();
    bypassAntiAdblockDialog();
  }

  // High-frequency polling (30ms) for instantaneous zero-latency skipping
  setInterval(monitor, 30);

  // Observer for rapid DOM mutations
  const observer = new MutationObserver(() => {
    monitor();
  });

  function initObserver() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    } else {
      window.addEventListener('DOMContentLoaded', initObserver, { once: true });
    }
  }

  initObserver();

  window.addEventListener('yt-navigate-finish', monitor);
  window.addEventListener('spfdone', monitor);
})();
