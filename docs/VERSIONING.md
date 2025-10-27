# Versioning Strategy

This project follows **Semantic Versioning (SemVer)** and **Git Flow** branching model for enterprise-grade version management.

## Branch Structure

### Main Branches
- **`main`** - Production-ready code, always deployable to GitHub Pages
- **`dev`** - Integration branch for ongoing development

### Supporting Branches
- **`release/v*`** - Release preparation branches (e.g., `release/v1.0.0`)
- **`feature/*`** - Feature development branches (e.g., `feature/new-design`)
- **`hotfix/*`** - Emergency fixes for production (e.g., `hotfix/critical-bug`)

## Version Numbering: `MAJOR.MINOR.PATCH`

### v1.0.0 (Current Release)
**Released:** October 27, 2025

**Features:**
- ✨ Dynamic particle background animation
- ⌨️ Animated typing effect in hero section
- 📅 Auto-calculating experience years (from 2018)
- 📱 Fully responsive mobile-first design
- 🎨 Interactive 3D tilt effects on project cards
- 🎭 Smooth scroll animations with Intersection Observer
- 🎓 Certificate modal system (PDF & image preview)
- 🏆 Social proof integration (Upwork, LinkedIn, CTO)
- 🖱️ Custom SVG cursor effects
- 🗂️ Clean enterprise-grade file structure
- 🤖 AI tools integration (N8N, Cursor AI, v0 by Vercel)
- 🔒 Content Security Policy (CSP) implementation
- 🛡️ Global error handling for browser extensions

**Branch:** `release/v1.0.0`  
**Tag:** `v1.0.0`

---

## Workflow

### Starting New Features
```bash
git checkout dev
git pull origin dev
git checkout -b feature/feature-name
# ... make changes ...
git commit -m "feat: description"
git push origin feature/feature-name
# Create PR to dev
```

### Creating a Release
```bash
git checkout dev
git checkout -b release/v2.0.0
# ... final adjustments ...
git commit -m "chore: prepare v2.0.0 release"
git push origin release/v2.0.0

# Merge to main
git checkout main
git merge release/v2.0.0
git tag -a v2.0.0 -m "Release notes here"
git push origin main
git push origin v2.0.0

# Merge back to dev
git checkout dev
git merge main
git push origin dev
```

### Hotfixes
```bash
git checkout main
git checkout -b hotfix/issue-description
# ... fix the issue ...
git commit -m "fix: critical issue"
git push origin hotfix/issue-description

# Merge to both main and dev
git checkout main
git merge hotfix/issue-description
git push origin main

git checkout dev
git merge hotfix/issue-description
git push origin dev
```

---

## Commit Message Convention

Following **Conventional Commits** for clear history:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependencies

**Examples:**
```
feat: add dark mode toggle
fix: resolve email overflow in contact section
docs: update README with new features
refactor: extract hero section into component
perf: optimize particle rendering
```

---

## Future Versions

### v2.0.0 (Planned)
New design direction with v0-generated mockups
- Complete visual redesign
- New color scheme and typography
- Enhanced animations and interactions
- Additional sections or features

---

## Tags and Releases

All release versions are tagged and pushed to GitHub:
```bash
git tag                    # List all tags
git show v1.0.0           # Show tag details
git checkout v1.0.0       # Checkout specific version
```

GitHub Releases page will contain:
- Release notes
- Feature highlights
- Breaking changes
- Migration guides (if applicable)

---

**Current Version:** `v1.0.0`  
**Current Branch:** `dev`  
**Latest Release:** `release/v1.0.0`  
**Production:** `main`

