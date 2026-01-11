import type { Float, Integer } from "../models/BrandedTypes";
import { parseCondition } from "../models/Condition";
import type { FeatureAcquisitionData } from "../models/FeatureData";
import { createFeatureData, DEFAULT_LEVEL } from "../models/FeatureData";
import { FEATURES } from "../models/features/definitions";
import { findFeatureByName } from "../models/features/registry";
import type { Feature, FeatureSpec } from "../models/features/types";
import { parseSkillRequirement } from "../models/SkillRequirement";
import type { LogicalLineResult, PreprocessedLine } from "./utils";
import {
  findFieldLineNumber,
  getLogicalLine,
  isNumericString,
  parseIntField,
  splitByComma,
} from "./utils";

/**
 * Represents a preprocessed line with original line number tracking
 */
type ParsedFeature = Feature & { isDescriptionOnly?: boolean };

/**
 * Parses a single feature definition string
 * Based on VB5 UnitData.cls AddFeature method (lines 151-307)
 *
 * @param featureText - Feature definition string (e.g., "変形Lv3=ドラゴン <地上> (術Lv2)")
 * @returns Feature object
 */
export function parseFeature(featureText: string): ParsedFeature {
  let ftype = "";
  let flevel = DEFAULT_LEVEL;
  let fdata = "";
  let requiredSkill = "";
  let requiredCondition = "";

  let buf = featureText.trim();

  // 1. Extract required skill from "(...)"
  if (buf.endsWith(")")) {
    const skillStart = buf.indexOf(" (");
    if (skillStart > 0) {
      requiredSkill = buf.substring(skillStart + 2, buf.length - 1).trim();
      buf = buf.substring(0, skillStart).trim();

      // If the entire string was "(...)", set to empty
      if (buf === "") {
        buf = featureText.trim();
        requiredSkill = "";
      }
    }
  }

  // 2. Extract required condition from "<...>"
  if (buf.endsWith(">")) {
    const conditionStart = buf.indexOf(" <");
    if (conditionStart > 0) {
      requiredCondition = buf
        .substring(conditionStart + 2, buf.length - 1)
        .trim();
      buf = buf.substring(0, conditionStart).trim();

      // If the entire string was "<...>", set to empty
      if (buf === "") {
        buf = featureText.trim();
        requiredCondition = "";
      }
    }
  }

  // 3. Parse level and parameters
  const lvIndex = buf.indexOf("Lv");
  const eqIndex = buf.indexOf("=");

  // Important: Ignore "Lv" if it appears after "=" (to exclude Lv in parameters)
  let validLvIndex = lvIndex;
  if (lvIndex > 0 && eqIndex > 0 && lvIndex > eqIndex) {
    validLvIndex = -1;
  }

  // 4. Split into 4 patterns
  if (validLvIndex > 0 && eqIndex > 0) {
    // Pattern 1: Both "Lv" and "=" exist
    // Example: "変形Lv3=ドラゴン"
    ftype = buf.substring(0, validLvIndex).trim();

    const levelStr = buf.substring(validLvIndex + 2, eqIndex).trim();
    flevel = parseFloat(levelStr) as Float;
    if (isNaN(flevel)) {
      flevel = DEFAULT_LEVEL;
    }

    fdata = buf.substring(eqIndex + 1).trim();
  } else if (validLvIndex > 0) {
    // Pattern 2: Only "Lv" exists
    // Example: "変形Lv3"
    ftype = buf.substring(0, validLvIndex).trim();

    const levelStr = buf.substring(validLvIndex + 2).trim();
    flevel = parseFloat(levelStr) as Float;
    if (isNaN(flevel)) {
      flevel = DEFAULT_LEVEL;
    }
  } else if (eqIndex > 0) {
    // Pattern 3: Only "=" exists
    // Example: "変形=ドラゴン"
    ftype = buf.substring(0, eqIndex).trim();
    fdata = buf.substring(eqIndex + 1).trim();
  } else {
    // Pattern 4: Neither exists
    // Example: "バリア"
    ftype = buf.trim();
  }

  // 5. Remove all double quotes from parameters
  // This handles both surrounding quotes and quotes within the parameter string
  fdata = fdata.replaceAll(`"`, "");

  // 6. Parse parameters / alias
  let visible = true;
  let displayName: string | undefined = undefined;
  let description: string | undefined = undefined;
  let isDescriptionOnly = false;
  let rawParameters: string[] | undefined = undefined;

  const tokens = fdata ? fdata.trim().split(/\s+/) : [];
  if (tokens.length > 0 && tokens[0] !== "") {
    const head = tokens[0];
    if (head === "非表示") {
      visible = false;
      if (tokens.length > 1) {
        rawParameters = tokens.slice(1);
      }
    } else if (head === "解説") {
      isDescriptionOnly = true;
      description = tokens.slice(1).join(" ");
    } else if (!isNumericString(head)) {
      displayName = head;
      if (tokens.length > 1) {
        rawParameters = tokens.slice(1);
      }
    } else {
      rawParameters = tokens;
    }
  }

  // 7. Find the feature spec from the registry
  const foundSpec = findFeatureByName(ftype);
  const spec: FeatureSpec = foundSpec || FEATURES.DummyForUnit;

  // 8. Determine the level to use
  // If no level was specified (DEFAULT_LEVEL), use spec's defaultLevel if available
  let effectiveLevel: number | undefined = flevel;
  if (effectiveLevel === DEFAULT_LEVEL) {
    if (spec.defaultLevel !== undefined) {
      effectiveLevel = spec.defaultLevel;
    } else {
      effectiveLevel = undefined;
    }
  }

  // 9. Create the Feature object
  const feature = createFeatureData({
    spec: spec || FEATURES.None,
    level: effectiveLevel,
    name: ftype,
    displayName: displayName,
    description: description,
    showLevel: true,
    visible: visible,
    requiredSkill: parseSkillRequirement(requiredSkill),
    requiredCondition: parseCondition(requiredCondition),
    rawParameters: rawParameters,
  });

  // Special handling for Dummy abilities: parameters are treated as description
  // e.g. "Name=Alias Description Text" -> displayName="Alias", description="Description Text"
  if (
    feature.spec === FEATURES.DummyForUnit &&
    !feature.description &&
    feature.rawParameters
  ) {
    feature.description = feature.rawParameters.join(" ");
    feature.rawParameters = undefined;
  }

  return {
    ...feature,
    isDescriptionOnly,
  };
}

/**
 * Parses pilot skills section (new format - multiple lines)
 * Parses pairs of (skill definition, acquisition level)
 *
 * @param lines - Preprocessed lines array
 * @param startLineIndex - Index of the line after "特殊能力" header
 * @param filePath - File path for error messages
 * @param pilotName - Pilot name for error messages
 * @returns Parsed skills as FeatureAcquisitionData, next line index, and warnings
 */
export function parsePilotSkillsNewFormat(
  lines: PreprocessedLine[],
  startLineIndex: number,
  filePath: string,
  pilotName: string
): {
  skills: FeatureAcquisitionData[];
  nextLineIndex: number;
  warnings: string[];
} {
  const parsedItems: {
    feature: ParsedFeature;
    requiredLevel: Integer;
  }[] = [];
  const warnings: string[] = [];
  let lineIndex = startLineIndex;
  let skillCount = 0;

  while (lineIndex < lines.length) {
    const logicalLine = getLogicalLine(lines, lineIndex);
    const fields = splitByComma(logicalLine.content);

    // Check if this is the stats line (7 fields starting with numbers: 格闘, 射撃, 命中, 回避, 技量, 反応, 性格)
    if (fields.length >= 7) {
      const firstFieldResult = parseIntField(fields[0], "");
      if (!firstFieldResult.warning) {
        break; // Stats line found
      }
    }

    // Parse pairs of (skill, acquisition level)
    let lastFeatureName = "";
    for (let i = 0; i < fields.length; i += 2) {
      let skillText = fields[i].trim();
      skillCount++;

      // Check for empty skill
      if (skillText === "") {
        const lineNumber = findFieldLineNumber(lines, logicalLine, i);
        warnings.push(
          `[${filePath}] ${pilotName}: 行頭から${skillCount}番目の特殊能力の設定が間違っています。 (行${lineNumber})`
        );
        continue;
      }

      // Check for numeric-only skill (invalid)
      if (isNumericString(skillText)) {
        const lineNumber = findFieldLineNumber(lines, logicalLine, i);
        warnings.push(
          `[${filePath}] ${pilotName}: 行頭から${skillCount}番目の特殊能力の設定が間違っています。 (行${lineNumber})`
        );
        continue;
      }

      // Handle omitted name (e.g. "Lv3")
      if (/^Lv\d/i.test(skillText) && lastFeatureName) {
        skillText = lastFeatureName + skillText;
      }

      // Parse the acquisition level
      let requiredLevel = 1 as Integer;
      if (i + 1 < fields.length) {
        const levelResult = parseIntField(
          fields[i + 1],
          `${skillText}の習得レベル`
        );
        requiredLevel = levelResult.value as Integer;
        if (levelResult.warning) {
          const lineNumber = findFieldLineNumber(lines, logicalLine, i + 1);
          warnings.push(
            `[${filePath}] ${pilotName}: ${levelResult.warning} (行${lineNumber})`
          );
          requiredLevel = 1 as Integer;
        }
      } else {
        const lineNumber = findFieldLineNumber(lines, logicalLine, i);
        warnings.push(
          `[${filePath}] ${pilotName}: 特殊能力「${skillText}」の習得レベルの設定が抜けています。 (行${lineNumber})`
        );
      }

      // Parse the skill and store in buffer
      const feature = parseFeature(skillText);
      if (feature.name) {
        lastFeatureName = feature.name;
      }
      parsedItems.push({
        feature,
        requiredLevel,
      });
    }

    lineIndex = logicalLine.endIndex + 1;
  }

  // Post-processing: Handle Description Definitions
  const validItems: {
    feature: ParsedFeature;
    requiredLevel: Integer;
  }[] = [];
  const descriptionFeatures: ParsedFeature[] = [];

  for (const item of parsedItems) {
    if (item.feature.isDescriptionOnly) {
      descriptionFeatures.push(item.feature);
    } else {
      validItems.push(item);
    }
  }

  // Apply descriptions
  for (const descFeature of descriptionFeatures) {
    const targetName = descFeature.name;
    // Find matching feature (search backwards)
    for (let i = validItems.length - 1; i >= 0; i--) {
      const v = validItems[i].feature;
      const vName = v.displayName || v.name;
      if (vName === targetName) {
        v.description = descFeature.description;
        break;
      }
    }
  }

  // Final Cleanup & Convert to FeatureAcquisitionData
  const skills: FeatureAcquisitionData[] = validItems.map((item) => {
    const f = item.feature;
    delete (f as Partial<ParsedFeature>).isDescriptionOnly;
    return {
      feature: f,
      requiredLevel: item.requiredLevel,
    };
  });

  return {
    skills,
    nextLineIndex: lineIndex,
    warnings,
  };
}

/**
 * Parses pilot skills section (old format - single line)
 * Format: "特殊能力, skill1, level1, skill2, level2, ..."
 *
 * @param lines - Preprocessed lines array
 * @param logicalLine - The logical line result for the "特殊能力,..." line
 * @param filePath - File path for error messages
 * @param pilotName - Pilot name for error messages
 * @returns Parsed skills as FeatureAcquisitionData and warnings
 */
export function parsePilotSkillsOldFormat(
  lines: PreprocessedLine[],
  logicalLine: LogicalLineResult,
  filePath: string,
  pilotName: string
): { skills: FeatureAcquisitionData[]; warnings: string[] } {
  const parsedItems: {
    feature: ParsedFeature;
    requiredLevel: Integer;
  }[] = [];
  const warnings: string[] = [];

  const fields = splitByComma(logicalLine.content);

  // Skip the first field ("特殊能力") and parse pairs
  for (let i = 1; i < fields.length; i += 2) {
    const skillText = fields[i].trim();

    // Check for empty skill
    if (skillText === "") {
      const lineNumber = findFieldLineNumber(lines, logicalLine, i);
      warnings.push(
        `[${filePath}] ${pilotName}: 行頭から${
          Math.floor(i / 2) + 1
        }番目の特殊能力の設定が間違っています。 (行${lineNumber})`
      );
      continue;
    }

    // Parse the acquisition level
    let requiredLevel = 1 as Integer;
    if (i + 1 < fields.length) {
      const levelResult = parseIntField(
        fields[i + 1],
        `${skillText}の習得レベル`
      );
      requiredLevel = levelResult.value as Integer;
      if (levelResult.warning) {
        const lineNumber = findFieldLineNumber(lines, logicalLine, i + 1);
        warnings.push(
          `[${filePath}] ${pilotName}: ${levelResult.warning} (行${lineNumber})`
        );
        requiredLevel = 1 as Integer;
      }
    } else {
      const lineNumber = findFieldLineNumber(lines, logicalLine, i);
      warnings.push(
        `[${filePath}] ${pilotName}: 特殊能力「${skillText}」の習得レベルの設定が抜けています。 (行${lineNumber})`
      );
    }

    // Parse the skill and store
    const feature = parseFeature(skillText);
    parsedItems.push({
      feature,
      requiredLevel,
    });
  }

  // Post-processing: Handle Description Definitions
  const validItems: {
    feature: ParsedFeature;
    requiredLevel: Integer;
  }[] = [];
  const descriptionFeatures: ParsedFeature[] = [];

  for (const item of parsedItems) {
    if (item.feature.isDescriptionOnly) {
      descriptionFeatures.push(item.feature);
    } else {
      validItems.push(item);
    }
  }

  // Apply descriptions
  for (const descFeature of descriptionFeatures) {
    const targetName = descFeature.name;
    // Find matching feature (search backwards)
    for (let i = validItems.length - 1; i >= 0; i--) {
      const v = validItems[i].feature;
      const vName = v.displayName || v.name;
      if (vName === targetName) {
        v.description = descFeature.description;
        break;
      }
    }
  }

  // Final Cleanup & Convert to FeatureAcquisitionData
  const skills: FeatureAcquisitionData[] = validItems.map((item) => {
    const f = item.feature;
    delete (f as Partial<ParsedFeature>).isDescriptionOnly;
    return {
      feature: f,
      requiredLevel: item.requiredLevel,
    };
  });

  return {
    skills,
    warnings,
  };
}

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
export function parseFeaturesNewFormat(
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
export function parseFeaturesOldFormat(
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
