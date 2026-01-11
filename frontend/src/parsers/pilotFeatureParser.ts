import type { Integer } from "../models/BrandedTypes";
import type { FeatureAcquisitionData } from "../models/FeatureData";
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
