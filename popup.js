// Get references to DOM elements
const likeCountInput = document.getElementById('likeCount');
const commentCountInput = document.getElementById('commentCount');
const startButton = document.getElementById('startButton');

// Enable/disable button based on input values
function updateButtonState() {
  const likeCount = parseInt(likeCountInput.value) || 0;
  const commentCount = parseInt(commentCountInput.value) || 0;
  
  // Enable button only if at least one input has a value greater than 0
  if (likeCount > 0 || commentCount > 0) {
    startButton.disabled = false;
  } else {
    startButton.disabled = true;
  }
}

// Add event listeners to inputs
likeCountInput.addEventListener('input', updateButtonState);
commentCountInput.addEventListener('input', updateButtonState);

// Handle button click
startButton.addEventListener('click', function() {
  const likeCount = parseInt(likeCountInput.value) || 0;
  const commentCount = parseInt(commentCountInput.value) || 0;
  
  // Open LinkedIn feed and send message to content script
  chrome.tabs.create({ url: 'https://www.linkedin.com/feed/' }, function(tab) {
    // Wait for the tab to load
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        // Remove the listener
        chrome.tabs.onUpdated.removeListener(listener);
        
        // Send message to content script
        chrome.tabs.sendMessage(tab.id, {
          action: 'startAutomation',
          likeCount: likeCount,
          commentCount: commentCount
        });
        
        // Close the popup
        window.close();
      }
    });
  });
});
