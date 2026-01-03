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
