// Runs in MAIN world (page context) to strip ad payloads from YouTube's engine before player loads
(() => {
  'use strict';

  function pruneAds(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    // Prune ad placement declarations
    if ('adPlacements' in obj) delete obj.adPlacements;
    if ('playerAds' in obj) delete obj.playerAds;
    if ('adSlots' in obj) delete obj.adSlots;
    if ('adBreakHeartbeatParams' in obj) delete obj.adBreakHeartbeatParams;
    if ('adSignalsInfo' in obj) delete obj.adSignalsInfo;

    // Nested playerResponse
    if (obj.playerResponse && typeof obj.playerResponse === 'object') {
      pruneAds(obj.playerResponse);
    }

    // Strip ad tracking beacons from playback tracking
    if (obj.playbackTracking && typeof obj.playbackTracking === 'object') {
      delete obj.playbackTracking.videostatsPlaybackUrl;
      delete obj.playbackTracking.videostatsDelayplayUrl;
      delete obj.playbackTracking.videostatsWatchtimeUrl;
      delete obj.playbackTracking.ptrackingUrl;
      delete obj.playbackTracking.qoeUrl;
      delete obj.playbackTracking.atrUrl;
    }

    // Remove ad config from playerConfig
    if (obj.playerConfig && typeof obj.playerConfig === 'object') {
      if (obj.playerConfig.adConfig) delete obj.playerConfig.adConfig;
    }

    return obj;
  }

  // 1. Hook JSON.parse (uBlock Origin json-prune core mechanism)
  // All YouTube player configs and inline JSON payloads pass through JSON.parse
  const rawJSONParse = JSON.parse;
  JSON.parse = function (...args) {
    const result = rawJSONParse.apply(this, args);
    if (result && typeof result === 'object') {
      pruneAds(result);
    }
    return result;
  };

  // 2. Hook Response.prototype.json (Fetch API JSON interception)
  const rawResponseJson = Response.prototype.json;
  Response.prototype.json = async function () {
    const result = await rawResponseJson.call(this);
    if (result && typeof result === 'object') {
      pruneAds(result);
    }
    return result;
  };

  // 3. Hook ytInitialPlayerResponse property
  let currentInitialPlayerResponse = window.ytInitialPlayerResponse;
  Object.defineProperty(window, 'ytInitialPlayerResponse', {
    get() {
      return currentInitialPlayerResponse;
    },
    set(val) {
      if (val && typeof val === 'object') {
        pruneAds(val);
      }
      currentInitialPlayerResponse = val;
    },
    configurable: true,
    enumerable: true
  });
  if (currentInitialPlayerResponse) {
    pruneAds(currentInitialPlayerResponse);
  }

  // 4. Hook window.ytplayer (player config carrier)
  let currentYtPlayer = window.ytplayer;
  Object.defineProperty(window, 'ytplayer', {
    get() {
      return currentYtPlayer;
    },
    set(val) {
      if (val && val.config && val.config.args) {
        if (val.config.args.raw_player_response) {
          pruneAds(val.config.args.raw_player_response);
        }
        if (typeof val.config.args.player_response === 'string') {
          try {
            const parsed = rawJSONParse(val.config.args.player_response);
            pruneAds(parsed);
            val.config.args.player_response = JSON.stringify(parsed);
          } catch (_) {}
        }
      }
      currentYtPlayer = val;
    },
    configurable: true,
    enumerable: true
  });

  // 5. Native Player API Instant Skip Safeguard
  function checkNativePlayer() {
    const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    if (!player) return;

    if (player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting')) {
      if (typeof player.skipAd === 'function') {
        try {
          player.skipAd();
        } catch (_) {}
      }
      const video = player.querySelector('video') || document.querySelector('video');
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = video.duration + 1;
      }
    }
  }

  setInterval(checkNativePlayer, 25);
})();
