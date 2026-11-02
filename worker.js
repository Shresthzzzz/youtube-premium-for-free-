(() => {
  const api = typeof chrome !== 'undefined' && chrome.runtime ? chrome : (typeof browser !== 'undefined' ? browser : null);
  if (!api) return;

  api.runtime.onInstalled.addListener((details) => {
    if (
      details.reason === 'browser_update' ||
      details.reason === 'chrome_update' ||
      details.reason === 'update'
    ) {
      return;
    } else if (details.reason === 'install') {
      api.tabs.create({
        url: 'https://www.youtube.com/'
      });
    }
  });

  api.action.onClicked.addListener(() => {
    api.tabs.create({
      url: 'https://github.com/Shresthzzzz/youtube-premium-for-free-'
    });
  });
})();