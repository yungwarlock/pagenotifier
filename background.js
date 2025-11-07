chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'pageChanged') {
    chrome.tabs.get(sender.tab.id, (tab) => {
      chrome.windows.get(tab.windowId, (window) => {
        if (!window.focused || !tab.active) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon48.png',
            title: 'Page Changed!',
            message: `The page at ${tab.url} has been updated.`
          });
        }
      });
    });
  }
});
