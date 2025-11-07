document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start');
  const stopButton = document.getElementById('stop');
  const statusDiv = document.getElementById('status');

  const updateStatus = (isWatching) => {
    statusDiv.textContent = isWatching ? 'Watching' : 'Not Watching';
  };

  chrome.storage.local.get('isWatching', (result) => {
    updateStatus(result.isWatching);
  });

  startButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tabs[0].id, { message: 'start' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            if (response && response.status === 'watching') {
              chrome.storage.local.set({ isWatching: true }, () => {
                updateStatus(true);
              });
            }
          }
        });
      });
    });
  });

  stopButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { message: 'stop' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          if (response && response.status === 'stopped') {
            chrome.storage.local.set({ isWatching: false }, () => {
              updateStatus(false);
            });
          }
        }
      });
    });
  });
});
