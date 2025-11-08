// history.js
// Renders stored automationHistory from chrome.storage.local with search, filter, pagination and CSV export.

function el(id) { return document.getElementById(id); }

function loadHistory(cb) {
    chrome.storage.local.get({ automationHistory: [] }, (res) => {
        cb(res.automationHistory || []);
    });
}

function renderRun(run) {
    const wrapper = document.createElement('div');
    wrapper.className = 'run';

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `
    <div><strong>Run at:</strong> ${new Date(run.runAt).toLocaleString()}</div>
    <div class="small">Likes: ${run.likedPosts.length} • Comments: ${run.commentedPosts.length}</div>
  `;
    wrapper.appendChild(meta);

    const likesDetails = document.createElement('details');
    likesDetails.innerHTML = `<summary>Liked posts (${run.likedPosts.length})</summary>`;
    const likesContent = document.createElement('div');
    likesContent.style.marginTop = '8px';
    if (run.likedPosts.length === 0) likesContent.textContent = 'None';
    else {
        run.likedPosts.forEach(p => {
            const d = document.createElement('div');
            d.className = 'post';
            d.innerHTML = `<div style="font-weight:600">${escapeHtml(p.author)}</div>
                     <div style="margin-top:4px">${escapeHtml(truncate(p.content, 400))}</div>
                     <div style="margin-top:6px;font-size:13px;color:#555"><a href="${encodeURI(p.postUrl)}" target="_blank" rel="noopener noreferrer">Open post</a> ${p.timestamp ? ' • ' + new Date(p.timestamp).toLocaleString() : ''}</div>`;
            likesContent.appendChild(d);
        });
    }
    likesDetails.appendChild(likesContent);
    wrapper.appendChild(likesDetails);

    const commentsDetails = document.createElement('details');
    commentsDetails.innerHTML = `<summary>Commented posts (${run.commentedPosts.length})</summary>`;
    const commentsContent = document.createElement('div');
    commentsContent.style.marginTop = '8px';
    if (run.commentedPosts.length === 0) commentsContent.textContent = 'None';
    else {
        run.commentedPosts.forEach(p => {
            const d = document.createElement('div');
            d.className = 'post';
            d.innerHTML = `<div style="font-weight:600">${escapeHtml(p.author)}</div>
                     <div style="margin-top:4px">${escapeHtml(truncate(p.content, 400))}</div>
                     <div style="margin-top:6px;font-size:13px;color:#555"><a href="${encodeURI(p.postUrl)}" target="_blank" rel="noopener noreferrer">Open post</a> ${p.timestamp ? ' • ' + new Date(p.timestamp).toLocaleString() : ''}</div>`;
            commentsContent.appendChild(d);
        });
    }
    commentsDetails.appendChild(commentsContent);
    wrapper.appendChild(commentsDetails);

    return wrapper;
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function truncate(s, n) {
    if (!s) return '';
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

// Filtering & pagination
let HISTORY = [];
let currentPage = 1;

function applyFiltersAndRender() {
    const q = el('search').value.trim().toLowerCase();
    const filterType = el('filterType').value;
    const pageSize = parseInt(el('pageSize').value, 10) || 25;

    let filtered = HISTORY.slice();

    if (filterType === 'liked') {
        filtered = filtered.map(run => ({
            runAt: run.runAt,
            likedPosts: run.likedPosts,
            commentedPosts: []
        })).filter(r => r.likedPosts.length > 0);
    } else if (filterType === 'commented') {
        filtered = filtered.map(run => ({
            runAt: run.runAt,
            likedPosts: [],
            commentedPosts: run.commentedPosts
        })).filter(r => r.commentedPosts.length > 0);
    }

    if (q) {
        filtered = filtered.filter(run => {
            const hay = JSON.stringify(run).toLowerCase();
            return hay.includes(q);
        });
    }

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    if (currentPage > pages) currentPage = pages;

    const start = (currentPage - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    const container = el('historyContainer');
    container.innerHTML = '';

    if (total === 0) {
        container.textContent = 'No history entries found for the selected filters.';
        return;
    }

    // pagination controls top
    const pagerTop = document.createElement('div');
    pagerTop.style.display = 'flex';
    pagerTop.style.justifyContent = 'space-between';
    pagerTop.style.marginBottom = '10px';
    pagerTop.innerHTML = `<div class="small">Showing ${start + 1} - ${Math.min(start + pageSize, total)} of ${total} runs</div>`;
    const pgControls = document.createElement('div');
    pgControls.style.display = 'flex';
    pgControls.style.gap = '6px';
    pgControls.innerHTML = `<button id="prevPage">Prev</button><button id="nextPage">Next</button>`;
    pagerTop.appendChild(pgControls);
    container.appendChild(pagerTop);

    pageItems.forEach(run => container.appendChild(renderRun(run)));

    // hooks for pagination buttons
    el('prevPage').addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; applyFiltersAndRender(); }
    });
    el('nextPage').addEventListener('click', () => {
        if (currentPage < pages) { currentPage++; applyFiltersAndRender(); }
    });
}

function exportCSV() {
    // Build CSV rows: runAt,type,author,content,postUrl,timestamp
    const rows = [];
    HISTORY.forEach(run => {
        run.likedPosts.forEach(p => rows.push({
            runAt: run.runAt,
            type: 'liked',
            author: p.author,
            content: p.content,
            postUrl: p.postUrl,
            timestamp: p.timestamp || ''
        }));
        run.commentedPosts.forEach(p => rows.push({
            runAt: run.runAt,
            type: 'commented',
            author: p.author,
            content: p.content,
            postUrl: p.postUrl,
            timestamp: p.timestamp || ''
        }));
    }));

    const header = ['runAt', 'type', 'author', 'content', 'postUrl', 'timestamp'];
    const csv = [header.join(',')].concat(rows.map(r => header.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'automation-history.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function clearHistory() {
    if (!confirm('Clear all saved history? This action cannot be undone.')) return;
    chrome.storage.local.set({ automationHistory: [] }, () => {
        HISTORY = [];
        applyFiltersAndRender();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    el('search').addEventListener('input', () => { currentPage = 1; applyFiltersAndRender(); });
    el('filterType').addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); });
    el('pageSize').addEventListener('change', () => { currentPage = 1; applyFiltersAndRender(); });
    el('exportCSV').addEventListener('click', exportCSV);
    el('clearHistory').addEventListener('click', clearHistory);

    loadHistory((history) => {
        // history is newest-first
        HISTORY = history || [];
        applyFiltersAndRender();
    });
});
