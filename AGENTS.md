# AGENTS.md - Development Guidelines for Enhanced Grok Export

## Overview

This document provides comprehensive guidelines for coding agents working on the Enhanced Grok Export userscript project. This is a browser userscript that exports Grok conversations from X.com with intelligent speaker detection and multi-format support.

## Build System & Commands

### Primary Commands

```bash
# Run all tests (validation + linting)
npm test

# Lint JavaScript code with ESLint
npm run lint

# Validate userscript headers and syntax
npm run validate

# Run security audit
npm run security

# Full release preparation (validate + security check)
npm run release

# Install development dependencies
npm run install-deps

# Check for outdated packages
npm run check-updates

# Build for distribution (no-op for userscript)
npm run build

# Development mode info
npm run dev
```

### Testing Commands

#### Running All Tests
```bash
npm test  # Runs userscript validation and basic checks
```

#### Running Specific Validation Scripts
```bash
# Validate userscript headers only
node scripts/validate-headers.js

# Test markdown preservation functionality
node scripts/test-markdown-fix.js

# Run ESLint on the userscript file
npx eslint "Enhanced Grok Export v2.4-2.4.1.user.js"
```

#### Manual Testing Requirements
Since this is a browser userscript, automated unit tests are limited. Manual testing is required:

1. **Install in userscript manager** (Tampermonkey recommended)
2. **Test on supported domains**: grok.com and x.com/i/grok
3. **Verify export functionality** for all formats: md, txt, json, pdf
4. **Test speaker detection accuracy** with various conversation types
5. **Validate cross-browser compatibility**

### CI/CD Commands (GitHub Actions)

The project uses GitHub Actions for continuous integration:
- **Validate**: Runs on push/PR, checks syntax, JSON, Markdown, links, and required files
- **Release Check**: Validates version consistency between userscript and changelog
- **Security Scan**: Basic security checks for dangerous patterns

## Code Style Guidelines

### JavaScript Standards

#### File Structure
```javascript
// ==UserScript==
// @name         Enhanced Grok Export v2.4
// @description  Export Grok conversations with improved detection and working PDF
// @version      2.4.1
// @author       iikoshteruu
// @grant        none
// @match        *://grok.com/*
// @match        *://x.com/*
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Configuration constants at top
    const CONFIG = {
        // ... configuration object
    };

    // Main functions follow
    function mainFunction() {
        // ... implementation
    }

    // Initialization at bottom
    function init() {
        // ... initialization code
    }

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

})();
```

#### Naming Conventions
- **Variables**: camelCase (`messageCount`, `exportFormat`)
- **Constants**: UPPER_SNAKE_CASE for config (`CONFIG.debug`)
- **Functions**: camelCase (`getConversationData`, `formatAsMarkdown`)
- **DOM IDs**: kebab-case with prefixes (`grok-export-button`, `share-modal`)
- **CSS Classes**: kebab-case (`message-bubble`, `export-menu`)

#### Code Organization
1. **Configuration** at the top level
2. **Utility functions** (helpers, formatters)
3. **Core business logic** (export, detection)
4. **UI creation** (buttons, menus, modals)
5. **Initialization** at the bottom

### ESLint Configuration

The project uses ESLint with the following key rules:

```javascript
// .eslintrc.js configuration
{
  env: {
    browser: true,    // Browser environment
    es2021: true,     // ES2021 features allowed
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'script'  // IIFE pattern (not modules)
  },
  rules: {
    'no-console': 'off',      // Allow console.log for debugging
    'no-unused-vars': 'warn', // Warn on unused variables
    'no-undef': 'off',        // Allow browser globals
  }
}
```

#### Formatting Rules

##### Indentation & Spacing
- Use 4 spaces for indentation
- No tabs allowed
- Consistent spacing around operators
- Space after commas, no space before

##### Line Length
- Maximum 120 characters per line
- Break long strings with concatenation or template literals
- Split complex expressions across multiple lines

##### Quotes & Templates
```javascript
// Use double quotes for strings
const message = "Hello world";

// Use template literals for interpolation
const greeting = `Hello ${name}, version ${version}`;

// Use single quotes for internal quotes
const selector = 'button[class*="export"]';
```

### Comments & Documentation

#### Function Comments
```javascript
/**
 * Enhanced conversation detection for Grok
 * @param {string} text - The message content
 * @param {number} index - Position in conversation
 * @returns {Object} Speaker detection result
 */
function detectGrokSpeaker(text, index) {
    // Implementation
}
```

#### Inline Comments
```javascript
// Configuration
const CONFIG = {
    buttonText: 'Export Full',  // Button label text
    debug: true,                // Enable debug logging
};

// Complex logic explanations
if (score > threshold) {
    // Higher score indicates Grok message
    return 'Grok';
}
```

### Error Handling

#### Try-Catch Patterns
```javascript
try {
    const result = riskyOperation();
    return result;
} catch (error) {
    debugLog('Operation failed:', error.message);
    throw new Error(`Operation failed: ${error.message}`);
}
```

#### Defensive Programming
```javascript
// Null checks
const text = element?.textContent?.trim() || '';

// Array bounds checking
if (messages && messages.length > 0) {
    // Process messages
}

// Type checking
if (typeof callback === 'function') {
    callback();
}
```

### Async/Await Usage

#### Async Function Pattern
```javascript
async function exportConversation(format) {
    try {
        // Show loading state
        showNotification('🔄 Loading conversation...', 0);

        // Async operation
        await loadFullConversation();

        // Process results
        const messages = getConversationData();

        // Continue with synchronous operations
        const content = formatAsMarkdown(messages);
        downloadFile(content, filename);

    } catch (error) {
        console.error('Export failed:', error);
        alert(`Export failed: ${error.message}`);
    }
}
```

#### Promise-Based Operations
```javascript
function loadFullConversation() {
    return new Promise((resolve) => {
        let scrollAttempts = 0;

        const scrollInterval = setInterval(() => {
            // Scroll logic
            scrollAttempts++;

            if (scrollAttempts >= CONFIG.maxScrollAttempts) {
                clearInterval(scrollInterval);
                resolve();
            }
        }, CONFIG.scrollDelay);
    });
}
```

## Architecture Patterns

### Configuration-Driven Design
```javascript
const CONFIG = {
    buttonText: 'Export Full',
    formats: ['txt', 'md', 'json', 'pdf'],
    defaultFormat: 'md',
    debug: true,
    // ... more config
};
```

### Strategy Pattern for Detection
```javascript
const strategies = [
    // Strategy 1: CSS selectors
    () => document.querySelectorAll('.message-bubble'),

    // Strategy 2: Fallback selectors
    () => document.querySelectorAll('.response-content-markdown'),

    // Strategy 3: Legacy selectors
    () => document.querySelectorAll('div[class*="css-146c3p1"]'),
];

for (let strategy of strategies) {
    try {
        const elements = strategy();
        if (elements.length > 0) {
            // Use this strategy
            break;
        }
    } catch (error) {
        // Try next strategy
    }
}
```

### Factory Pattern for Formatters
```javascript
function formatAsMarkdown(messages) {
    // Markdown formatting logic
}

function formatAsJSON(messages) {
    // JSON formatting logic
}

function formatAsText(messages) {
    // Plain text formatting logic
}

const formatters = {
    md: formatAsMarkdown,
    json: formatAsJSON,
    txt: formatAsText,
};
```

## Testing Guidelines

### Validation Scripts
- Use `npm run validate` to check userscript headers
- Use `npm run lint` for JavaScript linting with ESLint
- Use `node scripts/test-markdown-fix.js` for markdown preservation testing
- CI automatically validates on push/PR

### Manual Testing Checklist
- [ ] Install in userscript manager (Tampermonkey recommended)
- [ ] Test on x.com/i/grok and grok.com
- [ ] Verify export button appears
- [ ] Test all export formats (md, txt, json, pdf)
- [ ] Test Share to X functionality
- [ ] Verify speaker detection accuracy
- [ ] Check debug mode functionality
- [ ] Test cross-browser compatibility

## Security Considerations

### Input Validation
```javascript
// Sanitize user inputs
function sanitizeInput(input) {
    return input
        .replace(/[<>]/g, '')  // Remove potential HTML
        .trim()
        .substring(0, 1000);  // Length limit
}
```

### Content Security
- All processing happens client-side only
- No external API calls or data transmission
- No storage of sensitive information
- No execution of dynamic code

### Best Practices
- Avoid `eval()`, `innerHTML`, `document.write()`
- Use `textContent` instead of `innerHTML` when possible
- Validate all DOM manipulation
- Check for hardcoded secrets in code

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Userscript Managers
- Tampermonkey (recommended)
- Greasemonkey
- Violentmonkey

## Performance Guidelines

### DOM Operations
```javascript
// Cache DOM queries
const exportButton = document.getElementById('grok-export-button');

// Batch DOM updates
function updateUI() {
    button.disabled = true;
    button.textContent = 'Processing...';
    // ... more updates
}
```

### Memory Management
```javascript
// Clean up event listeners
function cleanup() {
    document.removeEventListener('click', handleClick);
    clearInterval(scrollInterval);
}
```

### Efficient Selectors
```javascript
// Prefer specific selectors
const messages = document.querySelectorAll('.message-bubble');

// Avoid expensive selectors
// BAD: document.querySelectorAll('*[class*="message"]')
// GOOD: document.querySelectorAll('.message-bubble')
```

## Git Workflow

### Commit Message Format
```
feat: add new export format support
fix: resolve speaker detection issue
docs: update installation instructions
refactor: improve code organization
test: add validation scripts
```

### Branch Naming
- `feature/description` for new features
- `fix/issue-description` for bug fixes
- `docs/update-description` for documentation
- `refactor/component-name` for code restructuring

## Quality Assurance

### Code Review Checklist
- [ ] ESLint passes without errors
- [ ] Userscript headers are valid
- [ ] No console errors in browser
- [ ] Cross-browser testing completed
- [ ] Security scan passes
- [ ] Documentation updated
- [ ] Version consistency maintained

### Release Checklist
- [ ] Update version in userscript header
- [ ] Update CHANGELOG.md
- [ ] Update README.md if needed
- [ ] Run full test suite
- [ ] Create GitHub release
- [ ] Update Greasyfork listing

## Troubleshooting

### Common Issues
1. **Button not appearing**: Check if on correct domain (grok.com or x.com)
2. **Export failing**: Verify userscript permissions and console errors
3. **Speaker detection inaccurate**: Check debug mode for scoring details
4. **PDF not generating**: Ensure CSP compliance and browser support

### Debug Mode
Enable debug mode in CONFIG to see detailed logging:
```javascript
const CONFIG = {
    debug: true,  // Set to true for verbose logging
};
```

This provides comprehensive development guidelines for maintaining code quality and consistency in the Enhanced Grok Export project.