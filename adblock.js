(() => {
  'use strict';

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
      try {
        const buttons = document.querySelectorAll(selector);
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].click();
        }
      } catch (_) {}
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

      // 1. Instantly mute audio
      video.muted = true;

      // 2. Set extreme playback rate
      video.playbackRate = 16.0;

      // 3. Immediately seek to end
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = video.duration + 1;
      }

      // 4. Click skip triggers
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
      if (parentDialog && parentDialog.parentNode) {
        parentDialog.remove();
        dismissed = true;
      }
    }

    dialogs.forEach(dialog => {
      const text = dialog.textContent || '';
      if (text.includes('Ad blockers violate YouTube') || text.includes('Ad blockers are not allowed')) {
        if (dialog.parentNode) {
          dialog.remove();
          dismissed = true;
        }
      }
    });

    if (dismissed) {
      const backdrops = document.querySelectorAll('tp-yt-iron-overlay-backdrop');
      backdrops.forEach(b => {
        if (b.parentNode) b.remove();
      });

      if (document.body) document.body.style.overflow = 'auto';
      if (document.documentElement) document.documentElement.style.overflow = 'auto';

      const video = document.querySelector('video');
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    }
  }

  function monitor() {
    try {
      handleVideoAds();
      bypassAntiAdblockDialog();
    } catch (_) {}
  }

  // High-frequency polling (30ms)
  setInterval(monitor, 30);

  // Observer for rapid DOM mutations
  const observer = new MutationObserver(() => {
    monitor();
  });

  function initObserver() {
    const target = document.body || document.documentElement;
    if (target) {
      observer.observe(target, {
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
