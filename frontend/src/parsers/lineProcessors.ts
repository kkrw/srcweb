export type PreprocessedLine = {
  /** Line content (with _ removed if it was a continuation line) */
  content: string;
  /** Original line number in the source file (1-based) */
  lineNumber: number;
  /** Whether this line continues to the next line (had _ at the end) */
  isContinuation: boolean;
};

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
 * Splits text into lines and performs preprocessing
 * - Removes empty lines
 * - Removes comment lines (starting with #)
 * - Removes inline comments (after //)
 * - Tracks original line numbers for accurate error reporting
 * - Preserves whitespace at continuation boundaries for proper joining
 * - Does NOT merge line continuations (handled by getLogicalLine)
 */
export function preprocessLines(text: string): PreprocessedLine[] {
  const rawLines = text.split(/\r?\n/);
  const processedLines: PreprocessedLine[] = [];
  let previousWasContinuation = false;

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i];
    const lineNumber = i + 1; // 1-based

    // Remove inline comments (//)
    const commentIndex = line.indexOf("//");
    if (commentIndex !== -1) {
      line = line.substring(0, commentIndex);
    }

    // Handle trimming based on continuation context
    // - If previous line was continuation: preserve left side (trimEnd only)
    // - Otherwise: trim both sides normally
    if (previousWasContinuation) {
      line = line.trimEnd();
    } else {
      line = line.trim();
    }

    // Preserve empty lines as section delimiters (VB5 uses empty lines to separate data)
    if (line.length === 0) {
      previousWasContinuation = false;
      processedLines.push({
        content: "",
        lineNumber: lineNumber,
        isContinuation: false,
      });
      continue;
    }

    // Skip comment lines (starting with #)
    if (line.startsWith("#")) {
      previousWasContinuation = false;
      continue;
    }

    // Check for line continuation
    const isContinuation = line.endsWith("_");
    if (isContinuation) {
      // Remove _ but preserve any whitespace before it
      line = line.substring(0, line.length - 1);
    }

    processedLines.push({
      content: line,
      lineNumber: lineNumber,
      isContinuation: isContinuation,
    });

    previousWasContinuation = isContinuation;
  }

  return processedLines;
}

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

