import { describe, it, expect } from 'vitest';
import { tone } from '../tone';

describe('tone API', () => {
  describe('greet', () => {
    it('should return a non-empty greeting without name', () => {
      const result = tone.greet();
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return a personalized greeting with name', () => {
      const result = tone.greet('Alex');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('Alex');
    });
  });

  describe('cta', () => {
    const ctaKinds: Array<'primary' | 'secondary' | 'download' | 'try' | 'contact' | 'learn'> = [
      'primary',
      'secondary',
      'download',
      'try',
      'contact',
      'learn',
    ];

    it.each(ctaKinds)('should return non-empty string for %s CTA', (kind) => {
      const result = tone.cta(kind);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('toast', () => {
    const toastKinds: Array<'success' | 'error' | 'info'> = ['success', 'error', 'info'];

    it.each(toastKinds)('should return object with title and description for %s', (kind) => {
      const result = tone.toast(kind);
      expect(result).toBeTruthy();
      expect(result.title).toBeTruthy();
      expect(result.description).toBeTruthy();
      expect(typeof result.title).toBe('string');
      expect(typeof result.description).toBe('string');
      expect(result.title.length).toBeGreaterThan(0);
      expect(result.description.length).toBeGreaterThan(0);
    });

    it('should include detail in description when provided', () => {
      const result = tone.toast('success', 'Your message was sent');
      expect(result.description).toContain('Your message was sent');
    });

    it('should work without detail parameter', () => {
      const result = tone.toast('error');
      expect(result.title).toBeTruthy();
      expect(result.description).toBeTruthy();
    });
  });

  describe('error', () => {
    const errorKinds: Array<'notFound' | 'network' | 'auth' | 'form' | 'generic'> = [
      'notFound',
      'network',
      'auth',
      'form',
      'generic',
    ];

    it.each(errorKinds)('should return non-empty string for %s error', (kind) => {
      const result = tone.error(kind);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should include detail when provided', () => {
      const result = tone.error('network', 'Try again in a moment');
      expect(result).toContain('Try again in a moment');
    });

    it('should work without detail parameter', () => {
      const result = tone.error('notFound');
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('empty', () => {
    const emptyKinds: Array<'blog' | 'lore' | 'search' | 'downloads'> = [
      'blog',
      'lore',
      'search',
      'downloads',
    ];

    it.each(emptyKinds)('should return object with title and description for %s', (kind) => {
      const result = tone.empty(kind);
      expect(result).toBeTruthy();
      expect(result.title).toBeTruthy();
      expect(result.description).toBeTruthy();
      expect(typeof result.title).toBe('string');
      expect(typeof result.description).toBe('string');
      expect(result.title.length).toBeGreaterThan(0);
      expect(result.description.length).toBeGreaterThan(0);
    });
  });

  describe('form', () => {
    const formKeys: Array<
      'name' | 'email' | 'subject' | 'message' | 'licenseKey' | 'password' | 'confirmPassword' | 'search'
    > = ['name', 'email', 'subject', 'message', 'licenseKey', 'password', 'confirmPassword', 'search'];

    it.each(formKeys)('should return form labels object for %s', (key) => {
      const result = tone.form(key);
      expect(result).toBeTruthy();
      expect(result.label).toBeTruthy();
      expect(result.validation).toBeTruthy();
      expect(typeof result.label).toBe('string');
      expect(typeof result.validation).toBe('object');
      expect(result.label.length).toBeGreaterThan(0);
      expect(result.validation.required).toBeTruthy();
    });

    it('should include placeholder when available', () => {
      const result = tone.form('email');
      // Some fields have placeholders, some don't - just check the structure
      expect(result).toHaveProperty('placeholder');
    });

    it('should have validation.required for all fields', () => {
      formKeys.forEach((key) => {
        const result = tone.form(key);
        expect(result.validation.required).toBeTruthy();
        expect(typeof result.validation.required).toBe('string');
      });
    });
  });

  describe('snippets', () => {
    it('should have snippets object', () => {
      expect(tone.snippets).toBeTruthy();
      expect(typeof tone.snippets).toBe('object');
    });

    it('should have all expected snippet keys', () => {
      const expectedKeys = [
        'writingAmbiance',
        'welcome',
        'emptyVault',
        'offline',
        'saving',
        'versioning',
        'consistency',
        'privacy',
        'support',
        'comingSoon',
      ];

      expectedKeys.forEach((key) => {
        expect(tone.snippets).toHaveProperty(key);
        expect(typeof tone.snippets[key as keyof typeof tone.snippets]).toBe('string');
        expect(tone.snippets[key as keyof typeof tone.snippets].length).toBeGreaterThan(0);
      });
    });
  });
});

