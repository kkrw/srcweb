/**
 * Test helper functions for parser tests
 */

import type { Feature } from "../../models/features/types";

/**
 * Helper function to find a feature by name for testing
 * Checks both spec.name (for defined features) and displayName (for undefined features)
 */
export function findFeatureByName(
  features: Feature[],
  name: string
): Feature | undefined {
  return features.find((f) => f.spec.name === name || f.displayName === name);
}
