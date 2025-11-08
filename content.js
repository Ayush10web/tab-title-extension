// content.js - automation + reporting
(function () {
    // small helpers
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
    function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function nowISO() { return new Date().toISOString(); }

    function textOf(el) { return el ? (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ') : ''; }

    // Attempt to find visible feed posts (article elements used by LinkedIn)
    function getVisiblePosts() {
        // common LinkedIn post containers: article, .occludable-update, .feed-shared-update-v2, etc.
        const candidates = Array.from(document.querySelectorAll('article, div.occludable-update, div.feed-shared-update-v2')).filter(el => el.offsetParent !== null);
        // de-duplicate by innerText hash
        const seen = new Set();
        const posts = [];
        for (const node of candidates) {
            try {
                const key = (node.innerText || '').slice(0, 300);
                if (!key || seen.has(key)) continue;
                seen.add(key);
                posts.push(node);
            } catch (e) { }
        }
        return posts;
    }

    // Helper to try to find like button inside a post node
    function findLikeButton(postNode) {
        // Try several likely selectors. Adjust if LinkedIn changes its markup.
        const selectors = [
            'button[aria-pressed][aria-label*="Like"]',
            'button[aria-label*="Like"]',
            'button[aria-label*="Like this"]',
            'button[data-control-name="like_toggle"]',
            'button.reaction-button', // fallback example
            'button[aria-label*="react"]'
        ];
        for (const sel of selectors) {
            const btn = postNode.querySelector(sel);
            if (btn) return btn;
        }
        // fallback: find action bar and first button
        const actionBar = postNode.querySelector('[data-control-name="reactions"], .social-details-social-counts, .feed-shared-social-action-bar');
        if (actionBar) {
            const btn = actionBar.querySelector('button');
            if (btn) return btn;
        }
        return null;
    }

    // Helper to check whether already liked (avoid re-liking)
    function isAlreadyLiked(likeButton) {
        if (!likeButton) return false;
        const aria = likeButton.getAttribute('aria-pressed');
        if (aria !== null) return (aria === 'true' || aria === 'pressed');
        // check class names
        const cls = (likeButton.className || '').toLowerCase();
        return cls.includes('reacted') || cls.includes('active') || cls.includes('is-active');
    }

    // Helpers to open comment box and post a comment
    async function postCommentOn(postNode, commentText) {
        // Try to click the comment button to open composer
        const commentBtnSelectors = [
            'button[aria-label*="Comment"]',
            'button[aria-label*="reply"]',
            'button[data-control-name="comment"]',
            'button[aria-pressed][aria-label*="Comment"]'
        ];
        let commentBtn = null;
        for (const s of commentBtnSelectors) {
            commentBtn = postNode.querySelector(s);
            if (commentBtn) break;
        }
        if (!commentBtn) {
            // try find action bar's comment button
            const actionBar = postNode.querySelector('.feed-shared-social-action-bar, .social-details-social-counts, .social-actions');
            if (actionBar) commentBtn = actionBar.querySelector('button:nth-child(2)');
        }
        if (!commentBtn) return { success: false, reason: 'no-comment-button' };

        try { commentBtn.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { }
        commentBtn.click();
        // small wait for composer
        await sleep(rand(600, 1200));

        // Try to find comment composer input (contenteditable div or textarea)
        // Common: div[role="textbox"] within the post, or textarea
        let composer = postNode.querySelector('div[role="textbox"][contenteditable="true"]') || postNode.querySelector('textarea') || document.querySelector('div[role="textbox"][contenteditable="true"]');
        if (!composer) {
            // search wider for comment composer that became visible
            composer = Array.from(document.querySelectorAll('div[role="textbox"], textarea')).find(el => el.offsetParent !== null && (el.getAttribute('contenteditable') === 'true' || el.tagName.toLowerCase() === 'textarea'));
        }
        if (!composer) return { success: false, reason: 'no-composer' };

        // Focus and insert text (simulate typing slowly)
        composer.focus();
        // For contenteditable, set innerText; for textarea set value
        if (composer.tagName.toLowerCase() === 'textarea' || composer.tagName.toLowerCase() === 'input') {
            composer.value = commentText;
            composer.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            // contenteditable
            // clear then type (quick)
            composer.innerText = commentText;
            const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true });
            composer.dispatchEvent(inputEvent);
        }

        await sleep(rand(500, 1200));

        // try to find submit button near composer
        let submitBtn = null;
        // look for button elements with text 'Post' or aria-label
        submitBtn = Array.from(document.querySelectorAll('button')).find(b => {
            const txt = (b.innerText || '').toLowerCase();
            if (txt.includes('post') || txt.includes('reply')) return true;
            const aria = (b.getAttribute('aria-label') || '').toLowerCase();
            if (aria.includes('post') || aria.includes('comment')) return true;
            return false;
        });

        // narrowing: prefer submit button inside the post node
        if (submitBtn) {
            const inside = postNode.contains(submitBtn);
            if (!inside) {
                // try to find a button inside postNode with post text
                const possible = Array.from(postNode.querySelectorAll('button')).find(b => {
                    const t = (b.innerText || '').toLowerCase();
                    return t.includes('post') || t.includes('reply');
                });
                if (possible) submitBtn = possible;
            }
        }

        if (!submitBtn) {
            // last fallback: press Enter (only if composer is contenteditable)
            try {
                const e = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter' });
                composer.dispatchEvent(e);
                await sleep(600);
                return { success: true, method: 'enter-key' };
            } catch (e) {
                return { success: false, reason: 'no-submit-button' };
            }
        }

        // Click submit
        try {
            submitBtn.click();
            await sleep(rand(800, 1400));
            return { success: true, method: 'button' };
        } catch (e) {
            return { success: false, reason: 'submit-click-failed' };
        }
    }

    // Extract some metadata about a post node
    function extractPostInfo(node) {
        const authorSelector = 'span.feed-shared-actor__name, a[href*="/in/"], .feed-shared-actor__name';
        const authorEl = node.querySelector(authorSelector) || node.querySelector('a[href*="/in/"]');
        const author = textOf(authorEl) || 'Unknown';
        // find url
        let postUrl = '';
        const link = node.querySelector('a[href*="/posts/"], a[href*="/activity/"], a[href*="/feed/"]') || node.querySelector('a[href*="/in/"]');
        if (link) postUrl = link.href;
        const content = textOf(node).slice(0, 500);
        return { author, postUrl, content };
    }

    // Main automation handler
    async function runAutomation({ likes = 0, comments = 0, commentText = '', maxPerRun = 50 }) {
        console.log('[automation] starting run', { likes, comments });
        const posts = getVisiblePosts();
        console.log('[automation] visible posts found:', posts.length);
        const likedPosts = [];
        const commentedPosts = [];

        // Work on copies so we don't mutate while iterating
        let toLike = Math.min(likes, maxPerRun);
        let toComment = Math.min(comments, maxPerRun);

        // Strategy: iterate visible posts top-to-bottom and perform likes then comments (or both) until counts exhausted.
        for (const post of posts) {
            if (toLike <= 0 && toComment <= 0) break;

            // scroll into view
            try { post.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { }

            const info = extractPostInfo(post);

            // Like
            if (toLike > 0) {
                const likeBtn = findLikeButton(post);
                if (likeBtn && !isAlreadyLiked(likeBtn)) {
                    try {
                        likeBtn.click();
                        await sleep(rand(500, 1400)); // short delay after click
                        likedPosts.push(Object.assign({}, info, { timestamp: nowISO() }));
                        toLike--;
                        console.log('[automation] liked', info);
                    } catch (e) {
                        console.warn('[automation] like failed', e);
                    }
                } else {
                    console.log('[automation] like skipped (already liked or no button)');
                }
            }

            // Comment
            if (toComment > 0) {
                try {
                    const commentResult = await postCommentOn(post, commentText);
                    if (commentResult && commentResult.success) {
                        commentedPosts.push(Object.assign({}, info, { timestamp: nowISO(), sentComment: commentText }));
                        toComment--;
                        console.log('[automation] commented', info, commentResult);
                    } else {
                        console.warn('[automation] comment failed for post', info, commentResult);
                    }
                } catch (e) {
                    console.error('[automation] comment exception', e);
                }
            }

            // Random pause between actions to mimic human behavior
            await sleep(rand(800, 2200));
        }

        // After loop, return results
        return { likedPosts, commentedPosts };
    }

    // Message listener
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (!msg || !msg.action) return;
        if (msg.action === 'getInteractions') {
            // Return heuristics for existing liked/commented posts in view
            const posts = getVisiblePosts();
            const liked = [];
            const commented = [];
            posts.forEach(p => {
                const info = extractPostInfo(p);
                // heuristics: check for 'you' in text near reactions or aria-pressed true
                const likeBtn = findLikeButton(p);
                if (likeBtn && isAlreadyLiked(likeBtn)) liked.push(Object.assign({}, info, { timestamp: nowISO() }));
                // comment heuristic: presence of comment count or 'comment' text in node
                if ((p.innerText || '').toLowerCase().includes('comment')) commented.push(Object.assign({}, info, { timestamp: nowISO() }));
            });
            sendResponse({ likedPosts: liked, commentedPosts: commented });
            return;
        } else if (msg.action === 'runAutomation') {
            // run automation asynchronously and sendResponse when done
            (async () => {
                try {
                    const res = await runAutomation({ likes: msg.likes || 0, comments: msg.comments || 0, commentText: msg.commentText || '', maxPerRun: msg.maxPerRun || 50 });
                    sendResponse(res);
                } catch (err) {
                    sendResponse({ error: err.message || String(err) });
                }
            })();
            return true; // keep channel open for async response
        }
    });
})();
