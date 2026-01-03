/**
 * Branded types for numeric values
 *
 * Provides type-level distinction between integer and floating-point numbers
 * to prevent accidental mixing of these types at compile time.
 *
 * Background:
 * - VB5 uses Integer/Long for whole numbers and Double for decimals
 * - TypeScript's `number` type cannot distinguish between integers and floats
 * - Branded types add a compile-time marker to enforce type safety
 *
 * Usage:
 * ```typescript
 * const hp: Integer = 1000 as Integer;
 * const level: Float = 2.5 as Float;
 * ```
 */

/**
 * Integer type (branded)
 * Represents whole numbers only (equivalent to VB5's Integer/Long)
 *
 * NOTE: Runtime behavior differs from VB5's CLng():
 * - VB5: Uses banker's rounding (.5 rounds to nearest even number)
 * - This implementation: Uses Math.round() (.5 always rounds up)
 *
 * Examples:
 * - VB5 CLng(2.5) → 2 (even), CLng(3.5) → 4 (even)
 * - JS Math.round(2.5) → 3, Math.round(3.5) → 4
 */
export type Integer = number & { readonly __brand: "Integer" };

/**
 * Float type (branded)
 * Represents floating-point numbers (equivalent to VB5's Double)
 */
export type Float = number & { readonly __brand: "Float" };

/**
 * Type guard to check if a value is an integer at runtime
 */
export function isInteger(value: number): value is Integer {
  return Number.isInteger(value);
}

/**
 * Converts a number to Integer with rounding
 * Warns if decimal part exists
 *
 * @param value - Number to convert
 * @returns Rounded integer value
 */
export function toInteger(value: number): Integer {
  return Math.round(value) as Integer;
}

/**
 * Converts a number to Float
 *
 * @param value - Number to convert
 * @returns Float value
 */
export function toFloat(value: number): Float {
  return value as Float;
}

/**
 * Checks if a number has a decimal part
 *
 * @param value - Number to check
 * @returns true if the number has a non-zero decimal part
 */
export function hasDecimalPart(value: number): boolean {
  return value !== Math.floor(value);
}
