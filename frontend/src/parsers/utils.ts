/**
 * Parser utilities for SRC data files
 */

import Encoding from "encoding-japanese";

/**
 * Result type for numeric field parsing with optional warning
 */
export interface ParseNumericResult {
  value: number;
  warning?: string;
}

/**
 * Decodes Shift-JIS buffer to UTF-8 string
 */
export function decodeShiftJIS(buffer: Buffer): string {
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
  const uint8Array = new Uint8Array(arrayBuffer);

  // Detect encoding (should be Shift-JIS)
  const detectedEncoding = Encoding.detect(uint8Array);

  // Convert to Unicode
  const unicodeArray = Encoding.convert(uint8Array, {
    to: "UNICODE",
    from: detectedEncoding || "SJIS",
  });

  // Convert to string
  return Encoding.codeToString(unicodeArray);
}

/**
 * Removes surrounding quotes from a string if present
 */
export function removeQuotes(str: string): string {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.substring(1, str.length - 1);
  }
  return str;
}

/**
 * Parses an integer field, returns 0 if invalid or "-"
 *
 * If a decimal value is provided, it will be rounded using Math.round().
 * A warning is returned if the input contained a decimal part.
 *
 * NOTE: Rounding behavior differs from VB5's CLng():
 * - VB5: Uses banker's rounding (0.5 rounds to nearest even number)
 *   - CLng(2.5) → 2 (even), CLng(3.5) → 4 (even)
 * - This implementation: Uses Math.round() (0.5 always rounds up)
 *   - Math.round(2.5) → 3, Math.round(3.5) → 4
 *
 * For most practical cases in SRC data files, this difference is negligible
 * as integer fields should not contain decimal values in properly formatted data.
 *
 * @param field - String value to parse
 * @param fieldName - Field name for warning messages (optional)
 * @returns Object with parsed value and optional warning
 */
export function parseIntField(
  field: string,
  fieldName?: string
): ParseNumericResult {
  if (field === "-" || field === "") {
    return { value: 0 };
  }

  const num = parseFloat(field);
  if (isNaN(num)) {
    const warning = fieldName
      ? `${fieldName}の設定が間違っています。`
      : `整数値が必要なフィールドに不正な値が指定されています（${field}）。`;
    return { value: 0, warning };
  }
  const rounded = Math.round(num);

  // Check if the original value had a decimal part
  if (num !== rounded) {
    const warning = fieldName
      ? `${fieldName}に実数値が指定されたため、整数に変換されました（${field} → ${rounded}）。`
      : `整数項目に実数値が指定されたため、変換されました（${field} → ${rounded}）。`;
    return { value: rounded, warning };
  }

  return { value: rounded };
}

/**
 * Parses a floating-point field, returns 0 if invalid or "-"
 *
 * @param field - String value to parse
 * @returns Parsed float value
 */
export function parseFloatField(field: string): number {
  if (field === "-" || field === "") {
    return 0;
  }
  const num = parseFloat(field);
  return isNaN(num) ? 0 : num;
}

/**
 * Parses an optional integer field (handles "-" as "no value")
 * Returns 0 if the field represents "no value", otherwise parses as integer with warning.
 *
 * This is a convenience wrapper for the common pattern:
 * ```typescript
 * isNoValue(field) ? 0 : parseIntField(field, fieldName)
 * ```
 *
 * @param field - String value to parse
 * @param fieldName - Field name for warning messages (optional)
 * @returns Object with parsed value and optional warning
 */
export function parseOptionalIntField(
  field: string,
  fieldName?: string
): ParseNumericResult {
  if (isNoValue(field)) {
    return { value: 0 };
  }
  return parseIntField(field, fieldName);
}

/**
 * Checks if a field represents "no value" (-, empty string)
 */
export function isNoValue(field: string): boolean {
  return field === "-" || field === "";
}

/**
 * Checks if a field is a numeric string (invalid for feature names in new format)
 *
 * Equivalent to VB5's IsNumeric() function.
 * In SRC data format, feature names cannot be pure numeric values in new format.
 * This prevents ambiguity with numeric parameters.
 *
 * Based on VB5 UnitDataList.cls lines 396-401 (new format only)
 *
 * @param field - Field to check
 * @returns true if the field is numeric (invalid feature name), false otherwise
 *
 * @example
 * isNumericString("123") // true (invalid - positive integer)
 * isNumericString("0") // true (invalid - zero)
 * isNumericString("-5") // true (invalid - negative integer)
 * isNumericString("3.14") // true (invalid - decimal)
 * isNumericString("シールドLv3") // false (valid - contains non-numeric characters)
 * isNumericString("ＨＰ回復Lv-1") // false (valid - contains non-numeric characters)
 * isNumericString("") // false (empty string, handled separately)
 * isNumericString("-") // false (hyphen only, handled separately)
 */
export function isNumericString(field: string): boolean {
  if (field === "" || field === "-") {
    return false;
  }
  return !isNaN(Number(field));
}

/**
 * Converts Katakana string to Hiragana
 * Used for default KanaName generation from Nickname (VB5 behavior)
 */
export function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}
