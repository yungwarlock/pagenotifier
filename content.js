let watching = false;
let initialContent = '';

const observer = new MutationObserver(mutations => {
  if (watching) {
    const currentContent = document.body.innerHTML;
    if (currentContent !== initialContent) {
      chrome.runtime.sendMessage({ message: 'pageChanged' });
      initialContent = currentContent; // Update the initial content to avoid repeated notifications for the same change
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'start') {
    watching = true;
    initialContent = document.body.innerHTML;
    observer.observe(document.body, { childList: true, subtree: true });
    sendResponse({ status: 'watching' });
  } else if (request.message === 'stop') {
    watching = false;
    observer.disconnect();
    sendResponse({ status: 'stopped' });
  }
});
