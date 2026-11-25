import { describe, expect, it } from 'vitest';
import { toRoman } from '../src/lib/roman';

describe('toRoman: the TOC numerals match CSS upper-roman on the articles', () => {
  it('writes the numerals the philosophy page uses', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(toRoman)).toEqual([
      'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
    ]);
  });

  it('handles subtractive pairs further up', () => {
    expect(toRoman(40)).toBe('XL');
    expect(toRoman(90)).toBe('XC');
    expect(toRoman(1999)).toBe('MCMXCIX');
  });

  it('refuses values CSS upper-roman cannot write', () => {
    expect(() => toRoman(0)).toThrow(RangeError);
    expect(() => toRoman(4000)).toThrow(RangeError);
    expect(() => toRoman(1.5)).toThrow(RangeError);
  });
});
