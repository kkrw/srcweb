import type { Feature } from "../models/features/types";
import { type ParsedFeature, parseFeature } from "./featureParser";
import {
  findFieldLineNumber,
  getLogicalLine,
  type LogicalLineResult,
  type PreprocessedLine,
  splitByComma,
} from "./lineProcessors";
import { isNumericString, parseIntField } from "./utils";
/**
 * Parses new format features section (multiple lines)
 * Based on VB5 UnitDataList.cls lines 358-411
 *
 * @param lines - Preprocessed lines array
 * @param startLineIndex - Index of the line after "特殊能力" header
 * @param filePath - File path for error messages
 * @param unitName - Unit name for error messages
 * @returns Parsed features, next line index, and warnings
 */
export function parseUnitFeaturesNewFormat(
  lines: PreprocessedLine[],
  startLineIndex: number,
  filePath: string,
  unitName: string
): { features: Feature[]; nextLineIndex: number; warnings: string[] } {
  const features: ParsedFeature[] = [];
  const warnings: string[] = [];
  let lineIndex = startLineIndex;
  let featureCount = 0;

  while (lineIndex < lines.length) {
    const logicalLine = getLogicalLine(lines, lineIndex);
    const fields = splitByComma(logicalLine.content);

    // Check if this is the HP/EN/Armor/Mobility line (4 numeric fields)
    if (
      fields.length === 4 &&
      fields.every((f) => !isNaN(parseIntField(f).value))
    ) {
      // This is the stats line, stop parsing features
      break;
    }

    // Parse each field in the line as a feature
    for (let i = 0; i < fields.length; i++) {
      const fieldText = fields[i].trim();
      featureCount++;

      // Check for empty or numeric features (invalid in new format)
      // Based on VB5 UnitDataList.cls lines 396-401
      if (fieldText === "") {
        const lineNumber = findFieldLineNumber(lines, logicalLine, i);
        warnings.push(
          `[${filePath}] ${unitName}: 行頭から${featureCount}番目の特殊能力の設定が間違っています。 (行${lineNumber})`
        );
        continue;
      }

      if (isNumericString(fieldText)) {
        const lineNumber = findFieldLineNumber(lines, logicalLine, i);
        warnings.push(
          `[${filePath}] ${unitName}: 行頭から${featureCount}番目の特殊能力の設定が間違っています。 (行${lineNumber})`
        );
        continue;
      }

      // Parse the feature
      const feature = parseFeature(fieldText);
      features.push(feature);
    }

    lineIndex = logicalLine.endIndex + 1;
  }

  // Post-processing: Handle Description Definitions
  const validFeatures: Feature[] = [];
  const descriptionFeatures: ParsedFeature[] = [];

  for (const f of features) {
    if (f.isDescriptionOnly) {
      descriptionFeatures.push(f);
    } else {
      validFeatures.push(f);
    }
  }

  // Apply descriptions
  for (const descFeature of descriptionFeatures) {
    // Find the feature to apply description to
    // "Left side name's displayName (if undefined, name)"
    const targetName = descFeature.name;

    // Find matching feature (search backwards to find the most recent one?)
    // Usually definitions modify preceding items.
    for (let i = validFeatures.length - 1; i >= 0; i--) {
      const v = validFeatures[i];
      const vName = v.displayName || v.name;
      if (vName === targetName) {
        v.description = descFeature.description;
        break;
      }
    }

    // If not found, ignore silently as per VB5 behavior/user spec ambiguity?
    // User didn't specify error behavior.
  }

  // Final Cleanup: Remove isDescriptionOnly from runtime objects
  validFeatures.forEach((f) => {
    delete (f as Partial<ParsedFeature>).isDescriptionOnly;
  });

  return {
    features: validFeatures,
    nextLineIndex: lineIndex,
    warnings,
  };
}

/**
 * Parses old format features section (single line)
 * Based on VB5 UnitDataList.cls lines 412-453
 *
 * @param lines - Preprocessed lines array
 * @param logicalLine - The logical line result for the "特殊能力,..." line
 * @param filePath - File path for error messages
 * @param unitName - Unit name for error messages
 * @returns Parsed features and warnings
 */
export function parseUnitFeaturesOldFormat(
  lines: PreprocessedLine[],
  logicalLine: LogicalLineResult,
  filePath: string,
  unitName: string
): { features: Feature[]; warnings: string[] } {
  const features: Feature[] = [];
  const warnings: string[] = [];

  const fields = splitByComma(logicalLine.content);

  // Skip the first field ("特殊能力")
  for (let i = 1; i < fields.length; i++) {
    const fieldText = fields[i].trim();

    // Check for empty features (invalid in old format)
    // Based on VB5 UnitDataList.cls lines 436-441
    // Note: Old format does NOT check for numeric-only features
    if (fieldText === "") {
      const lineNumber = findFieldLineNumber(lines, logicalLine, i);
      warnings.push(
        `[${filePath}] ${unitName}: 行頭から${i}番目の特殊能力の設定が間違っています。 (行${lineNumber})`
      );
      continue;
    }

    // Parse the feature
    const feature = parseFeature(fieldText);
    features.push(feature);
  }

  return {
    features,
    warnings,
  };
}
