import { describe, it, expect } from 'vitest';
import { greet } from '../src/index';

describe('Basic tests', () => {
  it('greet function works correctly', () => {
    expect(greet('World')).toBe('Hello, World!');
  });
}); 