/**
 * Parser utilities for SRC data files
 *
 * Common utilities for parsing Shift-JIS encoded text files
 */

import Encoding from 'encoding-japanese';

/**
 * Decodes Shift-JIS buffer to UTF-8 string
 */
export function decodeShiftJIS(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);

  // Detect encoding (should be Shift-JIS)
  const detectedEncoding = Encoding.detect(uint8Array);

  // Convert to Unicode
  const unicodeArray = Encoding.convert(uint8Array, {
    to: 'UNICODE',
    from: detectedEncoding || 'SJIS',
  });

  // Convert to string
  return Encoding.codeToString(unicodeArray);
}

/**
 * Splits text into lines and performs preprocessing
 * - Removes empty lines
 * - Removes comment lines (starting with #)
 * - Removes inline comments (after //)
 * - Handles line continuation (_)
 */
export function preprocessLines(text: string): string[] {
  const rawLines = text.split(/\r?\n/);
  const processedLines: string[] = [];
  let currentLine = '';

  for (let line of rawLines) {
    // Remove inline comments (//)
    const commentIndex = line.indexOf('//');
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
    if (line.startsWith('#')) {
      continue;
    }

    // Handle line continuation (_)
    if (line.endsWith('_')) {
      // Remove _ and trailing spaces before continuing
      currentLine += line.substring(0, line.length - 1).trimEnd();
      continue;
    } else {
      currentLine += line;
      processedLines.push(currentLine);
      currentLine = '';
    }
  }

  // Add any remaining line
  if (currentLine.length > 0) {
    processedLines.push(currentLine);
  }

  return processedLines;
}

/**
 * Splits a line by comma, respecting quoted strings
 * Trims each field
 */
export function splitByComma(line: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      currentField += char;
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField.trim());
      currentField = '';
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
 */
export function parseIntField(field: string): number {
  if (field === '-' || field === '') {
    return 0;
  }
  const num = parseInt(field, 10);
  return isNaN(num) ? 0 : num;
}

/**
 * Checks if a field represents "no value" (-, empty string)
 */
export function isNoValue(field: string): boolean {
  return field === '-' || field === '';
}

/**
 * Parse terrain adaptation string (4 characters: AAAA, -ABA, etc.)
 */
export function parseAdaptation(field: string): string {
  // Should be 4 characters, each one of: S, A, B, C, D, -
  if (field.length !== 4) {
    console.warn(`Invalid adaptation format: "${field}", using default "----"`);
    return '----';
  }
  return field;
}

/**
 * Error type for parser errors
 */
export class ParseError extends Error {
  constructor(
    message: string,
    public line: number,
    public lineContent: string
  ) {
    super(`Parse error at line ${line}: ${message}\nLine: ${lineContent}`);
    this.name = 'ParseError';
  }
}
