// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startAutomation') {
    automateLikeAndComment(request.likeCount, request.commentCount);
  }
});

async function automateLikeAndComment(likeCount, commentCount) {
  // Arrays to track which posts were interacted with
  const likedPosts = [];
  const commentedPosts = [];
  
  // Get all posts on LinkedIn feed
  const posts = document.querySelectorAll('div[data-id^="urn:li:activity"]');
  
  console.log(`Found ${posts.length} posts on the feed`);
  console.log(`Target: ${likeCount} likes, ${commentCount} comments`);
  
  // Randomly select posts for liking
  const postsToLike = getRandomPosts(Array.from(posts), likeCount);
  for (const post of postsToLike) {
    try {
      // Get post author information
      const authorElement = post.querySelector('.update-components-actor__name');
      const authorName = authorElement ? authorElement.textContent.trim() : 'Unknown Author';
      
      const likeButton = post.querySelector('button[aria-label*="React"], button[aria-label*="Like"]');
      if (likeButton) {
        likeButton.click();
        likedPosts.push({
          author: authorName,
          timestamp: new Date().toLocaleTimeString()
        });
        console.log(`✅ Liked post by: ${authorName}`);
        await delay(1000); // Wait 1 second between actions
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  }
  
  // Randomly select posts for commenting
  const postsToComment = getRandomPosts(Array.from(posts), commentCount);
  for (const post of postsToComment) {
    try {
      // Get post author information
      const authorElement = post.querySelector('.update-components-actor__name');
      const authorName = authorElement ? authorElement.textContent.trim() : 'Unknown Author';
      
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
            commentedPosts.push({
              author: authorName,
              timestamp: new Date().toLocaleTimeString()
            });
            console.log(`💬 Commented on post by: ${authorName}`);
          }
        }
      }
      await delay(2000);
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  }
  
  // Display summary
  displaySummary(likedPosts, commentedPosts);
}

function displaySummary(likedPosts, commentedPosts) {
  console.log('\n========== AUTOMATION SUMMARY ==========');
  console.log(`\n✅ Liked ${likedPosts.length} posts:`);
  likedPosts.forEach((post, index) => {
    console.log(`  ${index + 1}. ${post.author} (at ${post.timestamp})`);
  });
  
  console.log(`\n💬 Commented on ${commentedPosts.length} posts:`);
  commentedPosts.forEach((post, index) => {
    console.log(`  ${index + 1}. ${post.author} (at ${post.timestamp})`);
  });
  console.log('\n========================================\n');
  
  // Create a visual notification on the page
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border: 2px solid #0a66c2;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 400px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  notification.innerHTML = `
    <h3 style="margin: 0 0 15px 0; color: #0a66c2; font-size: 18px;">✨ Automation Complete!</h3>
    <div style="margin-bottom: 15px;">
      <strong style="color: #28a745;">✅ Liked ${likedPosts.length} posts:</strong>
      <ul style="margin: 5px 0; padding-left: 20px; max-height: 150px; overflow-y: auto;">
        ${likedPosts.map(post => `<li style="margin: 3px 0;">${post.author}</li>`).join('')}
      </ul>
    </div>
    <div style="margin-bottom: 15px;">
      <strong style="color: #0a66c2;">💬 Commented on ${commentedPosts.length} posts:</strong>
      <ul style="margin: 5px 0; padding-left: 20px; max-height: 150px; overflow-y: auto;">
        ${commentedPosts.map(post => `<li style="margin: 3px 0;">${post.author}</li>`).join('')}
      </ul>
    </div>
    <button onclick="this.parentElement.remove()" style="
      background: #0a66c2;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      font-size: 14px;
    ">Close</button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 30 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 30000);

      // Send results to popup
    chrome.runtime.sendMessage({
        action: 'automationComplete',
        likedPosts: likedPosts.map(p => p.author),
        commentedPosts: commentedPosts.map(p => p.author)
    });
}

function getRandomPosts(posts, count) {
  const shuffled = posts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
