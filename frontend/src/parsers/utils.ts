/**
 * Parser utilities for SRC data files
 *
 * Common utilities for parsing Shift-JIS encoded text files
 */

import Encoding from "encoding-japanese";

/**
 * Decodes Shift-JIS buffer to UTF-8 string
 */
export function decodeShiftJIS(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);

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
 * Represents a preprocessed line with original line number tracking
 */
export type PreprocessedLine = {
  /** Line content (with _ removed if it was a continuation line) */
  content: string;
  /** Original line number in the source file (1-based) */
  lineNumber: number;
  /** Whether this line continues to the next line (had _ at the end) */
  isContinuation: boolean;
};

/**
 * Splits text into lines and performs preprocessing
 * - Removes empty lines
 * - Removes comment lines (starting with #)
 * - Removes inline comments (after //)
 * - Tracks original line numbers for accurate error reporting
 * - Does NOT merge line continuations (handled by getLogicalLine)
 */
export function preprocessLines(text: string): PreprocessedLine[] {
  const rawLines = text.split(/\r?\n/);
  const processedLines: PreprocessedLine[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i];
    const lineNumber = i + 1; // 1-based

    // Remove inline comments (//)
    const commentIndex = line.indexOf("//");
    if (commentIndex !== -1) {
      line = line.substring(0, commentIndex);
    }

    // Trim whitespace
    line = line.trim();

    // Skip empty lines
    if (line.length === 0) {
      continue;
    }

    // Skip comment lines (starting with #)
    if (line.startsWith("#")) {
      continue;
    }

    // Check for line continuation
    const isContinuation = line.endsWith("_");
    if (isContinuation) {
      // Remove _ and trailing spaces
      line = line.substring(0, line.length - 1).trimEnd();
    }

    processedLines.push({
      content: line,
      lineNumber: lineNumber,
      isContinuation: isContinuation,
    });
  }

  return processedLines;
}

/**
 * Result of parsing a logical line (with continuations merged)
 */
export type LogicalLineResult = {
  /** Merged content of the logical line */
  content: string;
  /** Starting index in the preprocessed lines array */
  startIndex: number;
  /** Ending index in the preprocessed lines array (inclusive) */
  endIndex: number;
  /** Line number of the first physical line */
  startLineNumber: number;
  /** Line number of the last physical line */
  endLineNumber: number;
};

/**
 * Gets a logical line (with continuations merged) starting at the given index
 *
 * @param lines - Preprocessed lines array
 * @param startIndex - Starting index in the lines array
 * @returns Logical line result with merged content and line range information
 */
export function getLogicalLine(
  lines: PreprocessedLine[],
  startIndex: number
): LogicalLineResult {
  if (startIndex >= lines.length) {
    throw new Error(`Index out of bounds: ${startIndex} >= ${lines.length}`);
  }

  let content = lines[startIndex].content;
  let endIndex = startIndex;
  const startLineNumber = lines[startIndex].lineNumber;

  // Merge continuation lines
  while (endIndex < lines.length && lines[endIndex].isContinuation) {
    endIndex++;
    if (endIndex < lines.length) {
      content += lines[endIndex].content;
    }
  }

  const endLineNumber = lines[endIndex].lineNumber;

  return {
    content,
    startIndex,
    endIndex,
    startLineNumber,
    endLineNumber,
  };
}

/**
 * Splits a line by comma, respecting quoted strings
 * Trims each field
 */
export function splitByComma(line: string): string[] {
  const fields: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      currentField += char;
    } else if (char === "," && !inQuotes) {
      fields.push(currentField.trim());
      currentField = "";
    } else {
      currentField += char;
    }
  }

  // Add the last field
  if (currentField.length > 0 || fields.length > 0) {
    fields.push(currentField.trim());
  }

  return fields;
}

/**
 * Finds the line number of a specific field within a logical line
 * This is called only when an error/warning occurs (lazy evaluation)
 *
 * @param lines - Preprocessed lines array
 * @param logicalLine - The logical line result containing the range
 * @param fieldIndex - Index of the field to locate (0-based)
 * @returns Line number where the field is located (1-based)
 */
export function findFieldLineNumber(
  lines: PreprocessedLine[],
  logicalLine: LogicalLineResult,
  fieldIndex: number
): number {
  let currentFieldIndex = 0;
  let inQuotes = false;

  // Search only within the logical line's range
  for (
    let lineIdx = logicalLine.startIndex;
    lineIdx <= logicalLine.endIndex;
    lineIdx++
  ) {
    const lineContent = lines[lineIdx].content;
    const lineNumber = lines[lineIdx].lineNumber;

    for (let i = 0; i < lineContent.length; i++) {
      const char = lineContent[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        // Field boundary found
        if (currentFieldIndex === fieldIndex) {
          // The target field ends on this line
          return lineNumber;
        }
        currentFieldIndex++;
      }
    }

    // End of current physical line
    // If we're at the target field, return this line number
    if (currentFieldIndex === fieldIndex) {
      return lineNumber;
    }
  }

  // Fallback (should not happen if fieldIndex is valid)
  return logicalLine.startLineNumber;
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
 * Result type for numeric field parsing with optional warning
 */
export interface ParseNumericResult {
  value: number;
  warning?: string;
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
    return { value: 0 };
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
 * Parse terrain adaptation string (4 characters: AAAA, -ABA, etc.)
 */
export function parseAdaptation(field: string): string {
  // Should be 4 characters, each one of: S, A, B, C, D, -
  if (field.length !== FORMAT.ADAPTATION_LENGTH) {
    console.warn(
      `Invalid adaptation format: "${field}", using default "${DEFAULTS.ADAPTATION}"`
    );
    return DEFAULTS.ADAPTATION;
  }
  return field;
}

/**
 * Error type for parser errors
 */
export class ParseError extends Error {
  public readonly lineNumber: number; // 1-based line number for display
  public readonly lineContent: string;

  constructor(
    message: string,
    lineNumber: number, // 1-based line number
    lineContent: string
  ) {
    super(
      `Parse error at line ${lineNumber}: ${message}\nLine: ${lineContent}`
    );
    this.name = "ParseError";
    this.lineNumber = lineNumber;
    this.lineContent = lineContent;
  }
}

/**
 * Validation utilities
 */

import { DEFAULTS, FORMAT } from "./constants";

/**
 * Validates and clamps a number to a range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): { value: number; warning?: string } {
  if (value < min || value > max) {
    return {
      value: Math.max(min, Math.min(max, value)),
      warning: `${fieldName}の値が範囲外です（${min}-${max}）。${Math.max(
        min,
        Math.min(max, value)
      )}に設定されました。`,
    };
  }
  return { value };
}

/**
 * Validates adaptation string (4 characters)
 */
export function validateAdaptation(adaptation: string): {
  value: string;
  warning?: string;
} {
  if (adaptation.length !== FORMAT.ADAPTATION_LENGTH) {
    return {
      value: DEFAULTS.ADAPTATION,
      warning: `地形適応の設定が間違っています（${FORMAT.ADAPTATION_LENGTH}文字必要）。${DEFAULTS.ADAPTATION}に設定されました。`,
    };
  }
  return { value: adaptation };
}

/**
 * Validates bitmap filename
 */
export function validateBitmap(bitmap: string): {
  value: string;
  warning?: string;
} {
  if (!bitmap.toLowerCase().endsWith(FORMAT.BITMAP_EXTENSION)) {
    return {
      value: DEFAULTS.BITMAP,
      warning: `ビットマップの設定が間違っています（${FORMAT.BITMAP_EXTENSION}ファイルが必要）。${DEFAULTS.BITMAP}に設定されました。`,
    };
  }
  return { value: bitmap };
}

/**
 * Validates that traits don't contain invalid Lv specifications
 */
export function validateTraits(
  traits: string,
  itemName: string
): string | null {
  if (traits.includes("Lv")) {
    return `${itemName}の属性のレベル指定が間違っています。`;
  }
  return null;
}
