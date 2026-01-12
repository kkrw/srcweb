/**
 * Parse result types and error class for SRC data file parsers
 */

/**
 * Result type for parsing operations
 */
export type ParseResult<T> =
  | {
      success: true;
      data: T;
      warnings?: string[]; // Validation warnings (non-fatal)
    }
  | {
      success: false;
      error: Error;
      warnings?: string[]; // Warnings collected before error
    };

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
