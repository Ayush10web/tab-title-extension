// popup.js - sends runAutomation message to content script (with injection fallback).
function el(id){ return document.getElementById(id); }
function setStatus(s){ el('status').textContent = 'Status: ' + s; }
function sanitize(s){ if(!s) return ''; return String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

async function sendMessageToTab(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      resolve(response);
    });
  });
}

function injectContentScript(tabId) {
  return new Promise((resolve, reject) => {
    if (chrome.scripting && chrome.scripting.executeScript) {
      chrome.scripting.executeScript({ target:{tabId}, files:['content.js'] }, (res) => {
        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
        resolve(res);
      });
      return;
    }
    // fallback
    if (chrome.tabs && chrome.tabs.executeScript) {
      try {
        chrome.tabs.executeScript(tabId, { file: 'content.js' }, (res) => {
          if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
          resolve(res);
        });
        return;
      } catch (e) {
        return reject(e);
      }
    }
    reject(new Error('No compatible injection API'));
  });
}

async function tryRun(tabId, payload) {
  try {
    return await sendMessageToTab(tabId, payload);
  } catch (err) {
    // inject then retry
    await injectContentScript(tabId);
    // short wait
    await new Promise(r => setTimeout(r, 200));
    return await sendMessageToTab(tabId, payload);
  }
}

function renderResults(liked, commented) {
  const likesList = el('likesList');
  const commentsList = el('commentsList');
  likesList.innerHTML = '';
  commentsList.innerHTML = '';

  if (!liked || liked.length === 0) likesList.textContent = 'No likes this run.';
  else liked.forEach(p => {
    const d = document.createElement('div'); d.className='item';
    d.innerHTML = `<div style="font-weight:600">${sanitize(p.author)}</div><div>${sanitize(p.content.slice(0,200))}</div><div class="meta"><a href="${encodeURI(p.postUrl)}" target="_blank">Open post</a></div>`;
    likesList.appendChild(d);
  });

  if (!commented || commented.length === 0) commentsList.textContent = 'No comments this run.';
  else commented.forEach(p => {
    const d = document.createElement('div'); d.className='item';
    d.innerHTML = `<div style="font-weight:600">${sanitize(p.author)}</div><div>${sanitize(p.content.slice(0,200))}</div><div class="meta">Comment: ${sanitize(p.sentComment || '')} • <a href="${encodeURI(p.postUrl)}" target="_blank">Open post</a></div>`;
    commentsList.appendChild(d);
  });
}

// save run to storage
function saveRun(liked, commented) {
  const runRecord = { runAt: new Date().toISOString(), likedPosts: liked||[], commentedPosts: commented||[] };
  chrome.storage.local.get({automationHistory: []}, (res) => {
    const h = res.automationHistory || [];
    h.unshift(runRecord);
    if (h.length > 500) h.length = 500;
    chrome.storage.local.set({automationHistory: h});
  });
}

document.addEventListener('DOMContentLoaded', () => {
  el('viewHistoryBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('history.html') });
  });

  el('runBtn').addEventListener('click', async () => {
    const confirmChecked = el('confirmRun').checked;
    if (!confirmChecked) return alert('Please confirm usage by checking the box.');

    const numLikes = parseInt(el('numLikes').value, 10) || 0;
    const numComments = parseInt(el('numComments').value, 10) || 0;
    const commentText = el('commentText').value || '';

    if (numComments > 0 && !commentText.trim()) return alert('Please provide comment text.');

    // safety caps
    const MAX_PER_RUN = 50;
    if (numLikes > MAX_PER_RUN || numComments > MAX_PER_RUN) {
      if (!confirm(`You requested a large number (over ${MAX_PER_RUN}). Continue?`)) return;
    }

    setStatus('locating tab...');
    const tabs = await new Promise(res => chrome.tabs.query({ active:true, currentWindow:true }, res));
    if (!tabs || !tabs[0]) { setStatus('no active tab'); return alert('No active tab'); }
    const tab = tabs[0];
    if (!tab.url || !tab.url.includes('linkedin.com')) {
      if (!confirm('This runs on LinkedIn feed pages. Continue on this tab?') ) return;
    }

    setStatus('running automation… (check console for logs)');
    el('runBtn').disabled = true;
    try {
      const payload = { action: 'runAutomation', likes: numLikes, comments: numComments, commentText, maxPerRun: MAX_PER_RUN };
      const result = await tryRun(tab.id, payload);
      // result: { likedPosts:[], commentedPosts:[] }
      setStatus('done');
      renderResults(result.likedPosts || [], result.commentedPosts || []);
      saveRun(result.likedPosts || [], result.commentedPosts || []);
    } catch (err) {
      console.error('Automation failed', err);
      alert('Automation failed: ' + err.message);
      setStatus('error');
    } finally {
      el('runBtn').disabled = false;
    }
  });
});
