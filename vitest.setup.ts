// Vitest setup file
// This file runs before all tests

// Set NODE_ENV to 'test' for error sanitizer logging
if (typeof process !== 'undefined') {
  process.env.NODE_ENV = process.env.NODE_ENV || 'test';
}
