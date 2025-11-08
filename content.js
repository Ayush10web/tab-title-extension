// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startAutomation') {
    automateLikeAndComment(request.likeCount, request.commentCount);
  }
});

async function automateLikeAndComment(likeCount, commentCount) {
  // Get all posts on LinkedIn feed
  const posts = document.querySelectorAll('div[data-id^="urn:li:activity"]');
  
  // Randomly select posts for liking
  const postsToLike = getRandomPosts(Array.from(posts), likeCount);
  for (const post of postsToLike) {
    const likeButton = post.querySelector('button[aria-label*="React"]');
    if (likeButton) {
      likeButton.click();
      await delay(1000); // Wait 1 second between actions
    }
  }
  
  // Randomly select posts for commenting
  const postsToComment = getRandomPosts(Array.from(posts), commentCount);
  for (const post of postsToComment) {
    const commentButton = post.querySelector('button[aria-label*="Comment"]');
    if (commentButton) {
      commentButton.click();
      await delay(500);
      
      // Find and fill comment box
      const commentBox = post.querySelector('div[contenteditable="true"]');
      if (commentBox) {
        commentBox.textContent = 'CFBR';
        await delay(500);
        
        // Click post button
        const postButton = post.querySelector('button[type="submit"]');
        if (postButton) {
          postButton.click();
        }
      }
    }
    await delay(2000);
  }
}

function getRandomPosts(posts, count) {
  const shuffled = posts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
