# Project Structure

## Overview
Enterprise-grade directory structure for the Interactive Portfolio OS project.

## Directory Tree

```
ryanjamesindangan.github.io/
├── assets/                      # Static assets
│   ├── certificates/            # Certification documents
│   │   ├── cto-certificate.pdf
│   │   ├── database-hacking.jpg
│   │   ├── bringing-down-a-website.jpg
│   │   ├── hacking-passwords.jpg
│   │   └── make-your-data-safe.jpg
│   ├── profile-photo.jpg        # Profile picture
│   ├── favicon.ico              # Site favicon
│   └── [icon files]             # Various app icons
│
├── css/                         # Stylesheets
│   └── devos.css                # Main stylesheet
│
├── js/                          # JavaScript modules
│   ├── config/                  # Configuration files
│   │   └── config.js            # Central configuration
│   ├── core/                    # Core functionality
│   ├── components/              # UI components
│   ├── utils/                   # Utility functions
│   │   └── helpers.js           # Helper functions
│   └── devos/                   # Legacy DevOS modules
│       ├── boot.js              # Boot sequence
│       ├── windows.js           # Window management
│       ├── apps.js              # Application content
│       └── main.js              # Main application logic
│
├── docs/                        # Documentation
│   ├── PROJECT-STRUCTURE.md     # This file
│   ├── ARCHITECTURE.md          # System architecture
│   ├── VERSIONING.md            # Version management
│   └── PROFILE-PHOTO-SETUP.md   # Setup instructions
│
├── index.html                   # Main entry point
├── index-v1.html                # Version 1 backup
├── index-v2.html                # Version 2 source
├── README.md                    # Project README
├── LICENSE                      # MIT License
└── .gitignore                   # Git ignore rules
```

## Directory Purpose

### `/assets`
Contains all static assets including images, certificates, and icons.
- **Certificates**: Professional credentials and course completion certificates
- **Profile Photo**: Personal branding image
- **Icons**: Favicon and app icons for various devices

### `/css`
Stylesheet organization following modular CSS principles.
- Currently single-file for simplicity
- Future: Can be split into:
  - `core/` - Base styles, reset, variables
  - `components/` - Component-specific styles
  - `layouts/` - Layout-specific styles

### `/js`
JavaScript organized by functionality:

#### `/js/config`
- **config.js**: Central configuration file
  - Personal information
  - Social links
  - UI settings
  - Feature flags
  - Asset paths

#### `/js/core`
Core system functionality:
- Window management
- Event handling
- State management
- System initialization

#### `/js/components`
UI component logic:
- Desktop icons
- Start menu
- Taskbar
- Context menu
- Notification system

#### `/js/utils`
Reusable utility functions:
- **helpers.js**: Common helper functions
  - Date/time formatting
  - Experience calculation
  - Viewport detection
  - Clipboard operations

#### `/js/devos`
Current implementation (will be refactored):
- **boot.js**: Boot screen sequence
- **windows.js**: Window Manager class
- **apps.js**: Application content
- **main.js**: Main application logic

### `/docs`
Comprehensive documentation:
- **PROJECT-STRUCTURE.md**: This file
- **ARCHITECTURE.md**: System design and architecture
- **VERSIONING.md**: Git Flow and version management
- **PROFILE-PHOTO-SETUP.md**: Setup instructions

## File Naming Conventions

### JavaScript Files
- **PascalCase**: For classes (`WindowManager.js`)
- **camelCase**: For functions and utilities (`helpers.js`)
- **kebab-case**: For components (`desktop-icons.js`)

### CSS Files
- **kebab-case**: All CSS files (`devos.css`, `window-styles.css`)

### HTML Files
- **kebab-case**: All HTML files (`index.html`, `index-v1.html`)

### Documentation
- **UPPERCASE**: For root-level docs (`README.md`, `LICENSE`)
- **UPPERCASE-WITH-DASH**: For detailed docs (`PROJECT-STRUCTURE.md`)

## Module System

Currently using vanilla JavaScript with global scope.

### Future Improvement: ES6 Modules
```javascript
// config/config.js
export const CONFIG = { ... };

// utils/helpers.js
import { CONFIG } from '../config/config.js';
export function calculateExperience() { ... }

// core/WindowManager.js
import { CONFIG } from '../config/config.js';
import { isMobile } from '../utils/helpers.js';
export class WindowManager { ... }
```

## Configuration Management

Centralized in `js/config/config.js`:
- All constants in one place
- Frozen objects to prevent modification
- Easy to update and maintain
- Type documentation with JSDoc

## Asset Organization

### Images
- **Naming**: `kebab-case.ext`
- **Location**: `assets/`
- **Types**: JPG for photos, PNG for graphics

### Certificates
- **Location**: `assets/certificates/`
- **PDF**: For official documents
- **JPG**: For course completion images

## Code Organization Principles

### 1. Separation of Concerns
- Configuration separate from logic
- UI separate from business logic
- Utilities are reusable

### 2. Single Responsibility
- Each file has one clear purpose
- Functions do one thing well
- Classes encapsulate related functionality

### 3. DRY (Don't Repeat Yourself)
- Common code in utilities
- Configuration in central file
- Reusable components

### 4. Documentation
- JSDoc for all functions
- README for overview
- Separate docs for complex topics

### 5. Scalability
- Easy to add new features
- Easy to modify existing features
- Easy to understand for new developers

## Development Workflow

### Adding New Feature
1. Update config if needed (`js/config/config.js`)
2. Create utility functions if needed (`js/utils/`)
3. Create component logic (`js/components/`)
4. Update main application (`js/devos/main.js`)
5. Add styles (`css/`)
6. Document changes (`docs/`)

### Modifying Existing Feature
1. Find relevant files using structure
2. Check config for constants
3. Update logic
4. Update documentation

## Future Improvements

### Planned Refactoring
1. **Split `devos.css`**:
   - `css/core/variables.css`
   - `css/core/base.css`
   - `css/components/window.css`
   - `css/components/taskbar.css`
   - `css/components/desktop-icons.css`

2. **Modularize `apps.js`**:
   - `js/components/apps/AboutApp.js`
   - `js/components/apps/SkillsApp.js`
   - `js/components/apps/ProjectsApp.js`
   - etc.

3. **Extract `WindowManager`**:
   - `js/core/WindowManager.js`
   - `js/core/EventBus.js`
   - `js/core/StateManager.js`

### Build System (Optional)
For further optimization:
- **Bundler**: Webpack or Rollup
- **Minification**: Terser for JS, cssnano for CSS
- **Optimization**: Tree shaking, code splitting
- **Development**: Hot reload, source maps

## Maintenance

### Regular Tasks
- Keep dependencies updated
- Review and refactor code
- Update documentation
- Test on various devices
- Monitor performance

### Version Control
- Follow Git Flow (see `docs/VERSIONING.md`)
- Meaningful commit messages
- Feature branches for new work
- Tag releases

## Resources

- **Git Flow**: `docs/VERSIONING.md`
- **Architecture**: `docs/ARCHITECTURE.md`
- **Setup**: `docs/PROFILE-PHOTO-SETUP.md`
- **Main README**: `README.md`

---

**Last Updated**: October 28, 2025  
**Version**: 2.0.0  
**Maintainer**: Ryan James Indangan

