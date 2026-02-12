module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'script', // Changed from 'module' to 'script' for IIFE
  },
  rules: {
    // Allow console.log for userscript debugging
    'no-console': 'off',
    // Allow unused variables (common in userscript development)
    'no-unused-vars': 'warn',
    // Allow undef (for browser globals)
    'no-undef': 'off',
  },
  globals: {
    // Browser globals
    window: 'readonly',
    document: 'readonly',
    console: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    setInterval: 'readonly',
    clearInterval: 'readonly',
    URL: 'readonly',
    Blob: 'readonly',
    navigator: 'readonly',
    location: 'readonly',
  },
};