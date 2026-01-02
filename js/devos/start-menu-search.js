// ===========================
// Start Menu Search Functionality
// ===========================

class StartMenuSearch {
    constructor() {
        this.searchInput = null;
        this.searchResults = [];
        this.init();
    }

    init() {
        this.searchInput = document.querySelector('.search-input');
        if (!this.searchInput) return;

        // Create results container
        const searchContainer = this.searchInput.closest('.search-box');
        if (searchContainer) {
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';
            resultsContainer.id = 'searchResults';
            searchContainer.parentElement.appendChild(resultsContainer);
        }

        // Apps database
        this.apps = [
            { id: 'about', name: 'About Me', icon: '👨‍💻', keywords: ['about', 'me', 'profile', 'bio', 'information'] },
            { id: 'skills', name: 'Technical Skills', icon: '🛠️', keywords: ['skills', 'technical', 'tech', 'stack', 'expertise', 'abilities'] },
            { id: 'experience', name: 'Work Experience', icon: '💼', keywords: ['experience', 'work', 'job', 'career', 'employment', 'professional'] },
            { id: 'projects', name: 'Featured Projects', icon: '🚀', keywords: ['projects', 'portfolio', 'work', 'apps', 'applications'] },
            { id: 'certifications', name: 'Certifications', icon: '🎓', keywords: ['certifications', 'certificates', 'credentials', 'education', 'courses'] },
            { id: 'terminal', name: 'Terminal', icon: '⌨️', keywords: ['terminal', 'command', 'cli', 'console', 'shell'] },
            { id: 'ai-lab', name: 'AI Lab', icon: '<img src="assets/clippy/clippy-on-yellow-paper.png" alt="Clippy" class="clippy-icon">', keywords: ['ai', 'artificial intelligence', 'ml', 'machine learning', 'lab', 'document intelligence'] },
            { id: 'snake', name: 'Snake Game', icon: '🐍', keywords: ['snake', 'game', 'play', 'entertainment', 'fun'] },
            { id: 'contact', name: 'Contact', icon: '📧', keywords: ['contact', 'email', 'reach', 'connect', 'message'] },
            { id: 'resume', name: 'Resume', icon: '📄', keywords: ['resume', 'cv', 'curriculum vitae', 'download'] }
        ];

        // Search input handler
        this.searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        // Handle Enter key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.searchResults.length > 0) {
                e.preventDefault();
                openApp(this.searchResults[0].id);
                this.closeSearch();
            }
        });

        // Close search on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.start-menu-search') && !e.target.closest('#searchResults')) {
                this.closeSearch();
            }
        });
    }

    performSearch(query) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;

        if (!query || query.trim() === '') {
            this.closeSearch();
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        this.searchResults = this.apps.filter(app => {
            const nameMatch = app.name.toLowerCase().includes(searchTerm);
            const keywordMatch = app.keywords.some(keyword => keyword.includes(searchTerm));
            return nameMatch || keywordMatch;
        }).slice(0, 5); // Limit to 5 results

        if (this.searchResults.length > 0) {
            this.displayResults(this.searchResults);
        } else {
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <div class="search-no-results-icon">🔍</div>
                    <div class="search-no-results-text">No results found</div>
                </div>
            `;
            resultsContainer.classList.add('active');
        }
    }

    displayResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = results.map((app, index) => `
            <button class="search-result-item" data-app="${app.id}" onclick="openApp('${app.id}'); window.startMenuSearch?.closeSearch();" ${index === 0 ? 'data-highlight="true"' : ''}>
                <span class="search-result-icon">${app.icon}</span>
                <span class="search-result-name">${app.name}</span>
                <span class="search-result-hint">Press Enter</span>
            </button>
        `).join('');

        resultsContainer.classList.add('active');
    }

    closeSearch() {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.classList.remove('active');
        }
        if (this.searchInput) {
            this.searchInput.value = '';
        }
    }
}

// Initialize search when start menu is opened
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const startMenu = document.getElementById('startMenu');
    
    if (startButton && startMenu) {
        startButton.addEventListener('click', () => {
            setTimeout(() => {
                if (!window.startMenuSearch) {
                    window.startMenuSearch = new StartMenuSearch();
                }
            }, 100);
        });
    }
});

