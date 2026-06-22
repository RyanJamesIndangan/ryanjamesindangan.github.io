const sleep = ms => new Promise(r => setTimeout(r, ms));
if (typeof openApp === 'function' && !document.getElementById('blogPostsContainer')) openApp('blog');
await sleep(900);
const out = {};
const visible = () => [...document.querySelectorAll('.blog-post-card')].filter(c => c.style.display !== 'none');
out.containerFound = !!document.getElementById('blogPostsContainer');
out.totalCards = document.querySelectorAll('.blog-post-card').length;
out.filtersBound = !!(window.initializeBlogFilters && initializeBlogFilters._bound);
out.searchBound = !!(window.initializeBlogSearch && initializeBlogSearch._bound);
out.modalsBound = !!(window.initializeBlogPostModals && initializeBlogPostModals._bound);

// filter → case-study
[...document.querySelectorAll('.blog-filter-btn')].find(b => b.dataset.filter === 'case-study')?.click();
await sleep(150);
out.caseStudyVisible = visible().length;
out.caseStudyAllMatch = visible().every(c => c.dataset.category === 'case-study');

// back to all
[...document.querySelectorAll('.blog-filter-btn')].find(b => b.dataset.filter === 'all')?.click();
await sleep(120);
out.allVisible = visible().length;

// search
const s = document.getElementById('blogSearchInput');
if (s) { s.value = 'ollama'; s.dispatchEvent(new Event('input', { bubbles: true })); }
await sleep(150);
out.searchVisible = visible().length;
out.searchTitles = visible().map(c => c.querySelector('h3')?.textContent.trim());
if (s) { s.value = ''; s.dispatchEvent(new Event('input', { bubbles: true })); }
await sleep(100);

// modal open via card click
visible()[0]?.click();
await sleep(150);
out.modalOpen = !!document.querySelector('.blog-modal-overlay');
out.modalTitle = document.querySelector('.blog-modal h2')?.textContent.trim();

// close via Escape
document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
await sleep(120);
out.modalClosedAfterEscape = !document.querySelector('.blog-modal-overlay');

return out;
