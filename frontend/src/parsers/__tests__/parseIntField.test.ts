/**
 * Tests for parseIntField with decimal value warnings
 */

import { describe, expect, it } from 'vitest';
import { parseIntField, parseOptionalIntField } from '../utils';

describe('parseIntField', () => {
  it('should parse integer values without warning', () => {
    const result = parseIntField('42', 'テスト項目');
    expect(result.value).toBe(42);
    expect(result.warning).toBeUndefined();
  });

  it('should round decimal values and return warning', () => {
    const result = parseIntField('42.7', 'HP');
    expect(result.value).toBe(43); // Math.round(42.7) = 43
    expect(result.warning).toBe('HPに実数値が指定されたため、整数に変換されました（42.7 → 43）。');
  });

  it('should round 0.5 upward (not banker\'s rounding)', () => {
    const result1 = parseIntField('2.5', 'テスト');
    expect(result1.value).toBe(3); // JS Math.round rounds 0.5 up

    const result2 = parseIntField('3.5', 'テスト');
    expect(result2.value).toBe(4);
  });

  it('should handle negative decimal values', () => {
    const result = parseIntField('-2.3', 'テスト');
    expect(result.value).toBe(-2); // Math.round(-2.3) = -2
    expect(result.warning).toBeDefined();
  });

  it('should handle dash as 0', () => {
    const result = parseIntField('-', 'テスト');
    expect(result.value).toBe(0);
    expect(result.warning).toBeUndefined();
  });

  it('should handle empty string as 0', () => {
    const result = parseIntField('', 'テスト');
    expect(result.value).toBe(0);
    expect(result.warning).toBeUndefined();
  });

  it('should return 0 for invalid values', () => {
    const result = parseIntField('invalid', 'テスト');
    expect(result.value).toBe(0);
    expect(result.warning).toBeUndefined();
  });
});

describe('parseOptionalIntField', () => {
  it('should return 0 for dash without warning', () => {
    const result = parseOptionalIntField('-', 'テスト');
    expect(result.value).toBe(0);
    expect(result.warning).toBeUndefined();
  });

  it('should parse valid integer', () => {
    const result = parseOptionalIntField('100', 'テスト');
    expect(result.value).toBe(100);
    expect(result.warning).toBeUndefined();
  });

  it('should round decimal and warn', () => {
    const result = parseOptionalIntField('100.6', '弾数');
    expect(result.value).toBe(101);
    expect(result.warning).toBe('弾数に実数値が指定されたため、整数に変換されました（100.6 → 101）。');
  });
});
