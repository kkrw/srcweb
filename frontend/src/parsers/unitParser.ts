/**
 * Unit Data Parser
 *
 * Parses unit.txt / robot.txt files in SRC format
 */

import {
  toFloat,
  type AbilityData,
  type AbilityEffect,
  type FeatureData,
  type Float,
  type Integer,
  type UnitData,
  type WeaponData,
} from "../models";
import { DEFAULT_LEVEL } from "../models/FeatureData";
import { Adaptation } from "../models/interpreter/Adaptation";
import { parseCondition } from "../models/interpreter/Condition";
import { parseSkillRequirement } from "../models/interpreter/SkillRequirement";
import { parseTraits } from "../models/interpreter/Trait";
import { createUnitData } from "../models/UnitData";
import {
  ABILITY_LIMITS,
  DEFAULTS,
  UNIT_LIMITS,
  UNIT_SIZES,
  WEAPON_LIMITS,
} from "./constants";
import { ERROR_MESSAGES, warningSummary } from "./messages";
import type { ParseResult } from "./ParseResult";
import type { LogicalLineResult, PreprocessedLine } from "./utils";
import {
  findFieldLineNumber,
  getLogicalLine,
  isNumericString,
  ParseError,
  parseIntField,
  parseOptionalIntField,
  preprocessLines,
  splitByComma,
  validateAdaptation,
  validateBitmap,
  validateRange,
  validateTraits,
} from "./utils";

/**
 * Validates unit name
 * - No half-width spaces
 * - No full-width parentheses
 * - No double quotes
 */
function validateUnitName(name: string): string | null {
  if (name.includes(" ")) {
    return ERROR_MESSAGES.NAME_HAS_SPACE;
  }
  if (name.includes("（") || name.includes("）")) {
    return ERROR_MESSAGES.NAME_HAS_FULLWIDTH_PAREN;
  }
  if (name.includes('"')) {
    return ERROR_MESSAGES.NAME_HAS_QUOTE;
  }
  return null;
}

/**
 * Validates unit size
 */
function validateSize(size: string): { value: string; warning?: string } {
  if (!UNIT_SIZES.includes(size as (typeof UNIT_SIZES)[number])) {
    return {
      value: DEFAULTS.SIZE,
      warning: `サイズの設定が間違っています（${UNIT_SIZES.join(", ")}）。${
        DEFAULTS.SIZE
      }に設定されました。`,
    };
  }
  return { value: size };
}

/**
 * Parses a single feature definition string
 * Based on VB5 UnitData.cls AddFeature method (lines 151-307)
 *
 * @param featureText - Feature definition string (e.g., "変形Lv3=ドラゴン <地上> (術Lv2)")
 * @returns FeatureData object
 */
function parseFeature(featureText: string): FeatureData {
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

  return {
    Name: ftype,
    Level: flevel,
    Parameters: fdata,
    RequiredSkill: parseSkillRequirement(requiredSkill),
    RequiredCondition: parseCondition(requiredCondition),
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
function parseFeaturesNewFormat(
  lines: PreprocessedLine[],
  startLineIndex: number,
  filePath: string,
  unitName: string
): { features: FeatureData[]; nextLineIndex: number; warnings: string[] } {
  const features: FeatureData[] = [];
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

  return {
    features,
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
function parseFeaturesOldFormat(
  lines: PreprocessedLine[],
  logicalLine: LogicalLineResult,
  filePath: string,
  unitName: string
): { features: FeatureData[]; warnings: string[] } {
  const features: FeatureData[] = [];
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

/**
 * Parses a unit data file
 * @param text - File content as string (Shift-JIS decoded to UTF-8)
 * @param filePath - File path for error messages (e.g., "Data/ガンダム/unit.txt")
 */
export function parseUnitFile(
  text: string,
  filePath: string = "unknown"
): ParseResult<UnitData[]> {
  try {
    const lines = preprocessLines(text);
    const units: UnitData[] = [];
    const allWarnings: string[] = [];
    let lineIndex = 0;

    while (lineIndex < lines.length) {
      const result = parseUnitData(lines, lineIndex, filePath);
      if (!result.success) {
        return { success: false, error: result.error, warnings: allWarnings };
      }
      units.push(result.data.unit);
      lineIndex = result.data.nextLineIndex;

      // Collect warnings
      if (result.warnings && result.warnings.length > 0) {
        allWarnings.push(...result.warnings);
      }
    }

    // TODO: Display warnings to user via UI dialog instead of console
    // Most scenario creators and players are not technical users and won't check the console
    if (allWarnings.length > 0) {
      console.warn(
        `[${filePath}] ${warningSummary(
          allWarnings.length
        )}：\n${allWarnings.join("\n")}`
      );
    }

    return {
      success: true,
      data: units,
      warnings: allWarnings.length > 0 ? allWarnings : undefined,
    };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

/**
 * Internal result type for parsing a single unit
 */
type ParseUnitResult = ParseResult<{
  unit: UnitData;
  nextLineIndex: number;
}>;

/**
 * Parses a single unit data entry
 * @param lines - Preprocessed lines
 * @param startIndex - Starting line index
 * @param filePath - File path for error messages
 */
function parseUnitData(
  lines: PreprocessedLine[],
  startIndex: number,
  filePath: string
): ParseUnitResult {
  try {
    let lineIndex = startIndex;
    const warnings: string[] = [];

    // Line 1: Name
    if (lineIndex >= lines.length) {
      const lastLineNum =
        lines.length > 0 ? lines[lines.length - 1].lineNumber : 1;
      throw new ParseError(ERROR_MESSAGES.UNEXPECTED_EOF, lastLineNum, "");
    }
    const nameLogicalLine = getLogicalLine(lines, lineIndex);
    const name = nameLogicalLine.content;
    lineIndex = nameLogicalLine.endIndex + 1;

    // Validate unit name
    const nameError = validateUnitName(name);
    if (nameError) {
      throw new ParseError(nameError, nameLogicalLine.startLineNumber, name);
    }

    // Line 2: Nickname, [KanaName,] UnitClass, PilotCapacity, NumItemSlots
    if (lineIndex >= lines.length) {
      throw new ParseError(
        ERROR_MESSAGES.MISSING_UNIT_PARAMS,
        nameLogicalLine.endLineNumber,
        ""
      );
    }
    const paramsLogicalLine = getLogicalLine(lines, lineIndex);
    const params = splitByComma(paramsLogicalLine.content);
    lineIndex = paramsLogicalLine.endIndex + 1;

    if (params.length < 4) {
      throw new ParseError(
        ERROR_MESSAGES.INSUFFICIENT_PARAMS,
        paramsLogicalLine.startLineNumber,
        paramsLogicalLine.content
      );
    }

    if (params.length > 5) {
      throw new ParseError(
        ERROR_MESSAGES.EXTRA_COMMA,
        paramsLogicalLine.startLineNumber,
        paramsLogicalLine.content
      );
    }

    const nickname = params[0];
    let kanaName: string;
    let unitClass: string;
    let pilotCapacity: Integer;
    let numItemSlots: Integer;

    if (params.length === 4) {
      // No KanaName specified
      kanaName = "";
      unitClass = params[1];
      const pilotResult = parseIntField(params[2], "パイロット数");
      pilotCapacity = pilotResult.value as Integer;
      if (pilotResult.warning) {
        const lineNumber = findFieldLineNumber(lines, paramsLogicalLine, 2);
        warnings.push(
          `[${filePath}] ${name}: ${pilotResult.warning} (行${lineNumber})`
        );
      }
      const itemResult = parseIntField(params[3], "アイテム数");
      numItemSlots = itemResult.value as Integer;
      if (itemResult.warning) {
        const lineNumber = findFieldLineNumber(lines, paramsLogicalLine, 3);
        warnings.push(
          `[${filePath}] ${name}: ${itemResult.warning} (行${lineNumber})`
        );
      }
    } else if (params.length >= 5) {
      // KanaName specified
      kanaName = params[1];
      unitClass = params[2];
      const pilotResult = parseIntField(params[3], "パイロット数");
      pilotCapacity = pilotResult.value as Integer;
      if (pilotResult.warning) {
        const lineNumber = findFieldLineNumber(lines, paramsLogicalLine, 3);
        warnings.push(
          `[${filePath}] ${name}: ${pilotResult.warning} (行${lineNumber})`
        );
      }
      const itemResult = parseIntField(params[4], "アイテム数");
      numItemSlots = itemResult.value as Integer;
      if (itemResult.warning) {
        const lineNumber = findFieldLineNumber(lines, paramsLogicalLine, 4);
        warnings.push(
          `[${filePath}] ${name}: ${itemResult.warning} (行${lineNumber})`
        );
      }
    } else {
      throw new ParseError(
        "Invalid parameters line",
        paramsLogicalLine.startLineNumber,
        paramsLogicalLine.content
      );
    }

    // Validate unit class (should not be numeric)
    if (isNumericString(unitClass)) {
      const unitClassIndex = params.length === 4 ? 1 : 2;
      const lineNumber = findFieldLineNumber(
        lines,
        paramsLogicalLine,
        unitClassIndex
      );
      warnings.push(
        `[${filePath}] ${name}: ユニットクラスの設定が間違っています。 (行${lineNumber})`
      );
      unitClass = DEFAULTS.UNIT_CLASS;
    }

    // Handle parentheses in PilotCapacity (special behavior)
    if (params[params.length - 2].startsWith("(")) {
      // This is a complex case, for now just parse the number
      const numStr = params[params.length - 2].replaceAll(`"`, "");
      const result = parseIntField(numStr, "パイロット数");
      pilotCapacity = -Math.abs(result.value) as Integer; // Negative indicates special behavior
      if (result.warning) {
        const pilotFieldIndex = params.length - 2;
        const lineNumber = findFieldLineNumber(
          lines,
          paramsLogicalLine,
          pilotFieldIndex
        );
        warnings.push(
          `[${filePath}] ${name}: ${result.warning} (行${lineNumber})`
        );
      }
    }

    // Validate pilot capacity
    if (pilotCapacity >= 0) {
      const pilotResult = validateRange(
        pilotCapacity,
        UNIT_LIMITS.PILOT_CAPACITY.MIN,
        UNIT_LIMITS.PILOT_CAPACITY.MAX,
        "パイロット数"
      );
      pilotCapacity = pilotResult.value as Integer;
      if (pilotResult.warning) {
        const pilotFieldIndex = params.length === 4 ? 2 : 3;
        const lineNumber = findFieldLineNumber(
          lines,
          paramsLogicalLine,
          pilotFieldIndex
        );
        warnings.push(
          `[${filePath}] ${name}: ${pilotResult.warning} (行${lineNumber})`
        );
      }
    } else {
      const pilotResult = validateRange(
        Math.abs(pilotCapacity),
        UNIT_LIMITS.PILOT_CAPACITY.MIN,
        UNIT_LIMITS.PILOT_CAPACITY.MAX,
        "パイロット数"
      );
      pilotCapacity = -pilotResult.value as Integer;
      if (pilotResult.warning) {
        const pilotFieldIndex = params.length === 4 ? 2 : 3;
        const lineNumber = findFieldLineNumber(
          lines,
          paramsLogicalLine,
          pilotFieldIndex
        );
        warnings.push(
          `[${filePath}] ${name}: ${pilotResult.warning} (行${lineNumber})`
        );
      }
    }

    // Validate item slots
    const itemSlotResult = validateRange(
      numItemSlots,
      UNIT_LIMITS.ITEM_SLOTS.MIN,
      UNIT_LIMITS.ITEM_SLOTS.MAX,
      "アイテム数"
    );
    numItemSlots = itemSlotResult.value as Integer;
    if (itemSlotResult.warning) {
      const itemFieldIndex = params.length === 4 ? 3 : 4;
      const lineNumber = findFieldLineNumber(
        lines,
        paramsLogicalLine,
        itemFieldIndex
      );
      warnings.push(
        `[${filePath}] ${name}: ${itemSlotResult.warning} (行${lineNumber})`
      );
    }

    // Line 3: MovementType, Speed, Size, Cost, ExpValue
    if (lineIndex >= lines.length) {
      throw new ParseError(
        ERROR_MESSAGES.MISSING_MOVEMENT_PARAMS,
        paramsLogicalLine.endLineNumber,
        ""
      );
    }
    const movementLogicalLine = getLogicalLine(lines, lineIndex);
    const movementParams = splitByComma(movementLogicalLine.content);
    lineIndex = movementLogicalLine.endIndex + 1;

    if (movementParams.length < 5) {
      throw new ParseError(
        ERROR_MESSAGES.INSUFFICIENT_MOVEMENT_PARAMS,
        movementLogicalLine.startLineNumber,
        movementLogicalLine.content
      );
    }

    const movementType = movementParams[0];

    const speedResult = parseIntField(movementParams[1], "移動力");
    let speed = speedResult.value as Integer;
    if (speedResult.warning) {
      const lineNumber = findFieldLineNumber(lines, movementLogicalLine, 1);
      warnings.push(
        `[${filePath}] ${name}: ${speedResult.warning} (行${lineNumber})`
      );
    }

    let size = movementParams[2];

    const costParse = parseIntField(movementParams[3], "修理費");
    let cost = costParse.value as Integer;
    if (costParse.warning) {
      const lineNumber = findFieldLineNumber(lines, movementLogicalLine, 3);
      warnings.push(
        `[${filePath}] ${name}: ${costParse.warning} (行${lineNumber})`
      );
    }

    const expParse = parseIntField(movementParams[4], "経験値");
    let expValue = expParse.value as Integer;
    if (expParse.warning) {
      const lineNumber = findFieldLineNumber(lines, movementLogicalLine, 4);
      warnings.push(
        `[${filePath}] ${name}: ${expParse.warning} (行${lineNumber})`
      );
    }

    // Validate speed
    const speedValidation = validateRange(
      speed,
      UNIT_LIMITS.SPEED.MIN,
      UNIT_LIMITS.SPEED.MAX,
      "移動力"
    );
    speed = speedValidation.value as Integer;
    if (speedValidation.warning) {
      const lineNumber = findFieldLineNumber(lines, movementLogicalLine, 1);
      warnings.push(
        `[${filePath}] ${name}: ${speedValidation.warning} (行${lineNumber})`
      );
    }

    // Validate size
    const sizeResult = validateSize(size);
    size = sizeResult.value;
    if (sizeResult.warning) {
      const lineNumber = findFieldLineNumber(lines, movementLogicalLine, 2);
      warnings.push(
        `[${filePath}] ${name}: ${sizeResult.warning} (行${lineNumber})`
      );
    }

    // Validate cost
    const costResult = validateRange(
      cost,
      UNIT_LIMITS.COST.MIN,
      UNIT_LIMITS.COST.MAX,
      "修理費"
    );
    cost = costResult.value as Integer;
    if (costResult.warning) {
      const lineNumber = findFieldLineNumber(lines, movementLogicalLine, 3);
      warnings.push(
        `[${filePath}] ${name}: ${costResult.warning} (行${lineNumber})`
      );
    }

    // Validate exp value
    const expResult = validateRange(
      expValue,
      UNIT_LIMITS.EXP_VALUE.MIN,
      UNIT_LIMITS.EXP_VALUE.MAX,
      "経験値"
    );
    expValue = expResult.value as Integer;
    if (expResult.warning) {
      const lineNumber = findFieldLineNumber(lines, movementLogicalLine, 4);
      warnings.push(
        `[${filePath}] ${name}: ${expResult.warning} (行${lineNumber})`
      );
    }

    // Line 4+: Special abilities (until we find HP line)
    const features: FeatureData[] = [];

    if (lineIndex >= lines.length) {
      throw new ParseError(
        ERROR_MESSAGES.MISSING_ABILITIES_SECTION,
        movementLogicalLine.endLineNumber,
        ""
      );
    }

    const featuresHeaderLogicalLine = getLogicalLine(lines, lineIndex);
    const featuresHeaderContent = featuresHeaderLogicalLine.content;

    if (featuresHeaderContent === "特殊能力なし") {
      // No special abilities
      lineIndex = featuresHeaderLogicalLine.endIndex + 1;
    } else if (featuresHeaderContent === "特殊能力") {
      // New format: multiple lines of abilities
      lineIndex = featuresHeaderLogicalLine.endIndex + 1;
      const result = parseFeaturesNewFormat(lines, lineIndex, filePath, name);
      features.push(...result.features);
      lineIndex = result.nextLineIndex;
      warnings.push(...result.warnings);
    } else if (featuresHeaderContent.startsWith("特殊能力,")) {
      // Old format: "特殊能力, ability1, ability2, ..."
      const result = parseFeaturesOldFormat(
        lines,
        featuresHeaderLogicalLine,
        filePath,
        name
      );
      features.push(...result.features);
      warnings.push(...result.warnings);
      lineIndex = featuresHeaderLogicalLine.endIndex + 1;
    } else {
      throw new ParseError(
        ERROR_MESSAGES.INVALID_ABILITIES_FORMAT,
        featuresHeaderLogicalLine.startLineNumber,
        featuresHeaderContent
      );
    }

    // Line: HP, EN, Armor, Mobility
    if (lineIndex >= lines.length) {
      const lastLineNum = featuresHeaderLogicalLine.endLineNumber;
      throw new ParseError(ERROR_MESSAGES.MISSING_STATS_LINE, lastLineNum, "");
    }
    const statsLogicalLine = getLogicalLine(lines, lineIndex);
    const stats = splitByComma(statsLogicalLine.content);
    lineIndex = statsLogicalLine.endIndex + 1;

    if (stats.length < 4) {
      throw new ParseError(
        ERROR_MESSAGES.INSUFFICIENT_STATS,
        statsLogicalLine.startLineNumber,
        statsLogicalLine.content
      );
    }

    const hpParseResult = parseIntField(stats[0], "HP");
    let hp = hpParseResult.value as Integer;
    if (hpParseResult.warning) {
      const lineNumber = findFieldLineNumber(lines, statsLogicalLine, 0);
      warnings.push(
        `[${filePath}] ${name}: ${hpParseResult.warning} (行${lineNumber})`
      );
    }

    const enParseResult = parseIntField(stats[1], "EN");
    let en = enParseResult.value as Integer;
    if (enParseResult.warning) {
      const lineNumber = findFieldLineNumber(lines, statsLogicalLine, 1);
      warnings.push(
        `[${filePath}] ${name}: ${enParseResult.warning} (行${lineNumber})`
      );
    }

    const armorParseResult = parseIntField(stats[2], "装甲");
    let armor = armorParseResult.value as Integer;
    if (armorParseResult.warning) {
      const lineNumber = findFieldLineNumber(lines, statsLogicalLine, 2);
      warnings.push(
        `[${filePath}] ${name}: ${armorParseResult.warning} (行${lineNumber})`
      );
    }

    const mobilityParseResult = parseIntField(stats[3], "運動性");
    let mobility = mobilityParseResult.value as Integer;
    if (mobilityParseResult.warning) {
      const lineNumber = findFieldLineNumber(lines, statsLogicalLine, 3);
      warnings.push(
        `[${filePath}] ${name}: ${mobilityParseResult.warning} (行${lineNumber})`
      );
    }

    // Validarte HP
    const hpResult = validateRange(
      hp,
      UNIT_LIMITS.HP.MIN,
      UNIT_LIMITS.HP.MAX,
      "最大HP"
    );
    hp = hpResult.value as Integer;
    if (hpResult.warning) {
      const lineNumber = findFieldLineNumber(lines, statsLogicalLine, 0);
      warnings.push(
        `[${filePath}] ${name}: ${hpResult.warning} (行${lineNumber})`
      );
    }

    // Validate EN
    const enResult = validateRange(
      en,
      UNIT_LIMITS.EN.MIN,
      UNIT_LIMITS.EN.MAX,
      "最大EN"
    );
    en = enResult.value as Integer;
    if (enResult.warning) {
      const lineNumber = findFieldLineNumber(lines, statsLogicalLine, 1);
      warnings.push(
        `[${filePath}] ${name}: ${enResult.warning} (行${lineNumber})`
      );
    }

    // Validate Armor
    const armorResult = validateRange(
      armor,
      UNIT_LIMITS.ARMOR.MIN,
      UNIT_LIMITS.ARMOR.MAX,
      "装甲"
    );
    armor = armorResult.value as Integer;
    if (armorResult.warning) {
      const lineNumber = findFieldLineNumber(lines, statsLogicalLine, 2);
      warnings.push(
        `[${filePath}] ${name}: ${armorResult.warning} (行${lineNumber})`
      );
    }

    // Validate Mobility
    const mobilityResult = validateRange(
      mobility,
      UNIT_LIMITS.MOBILITY.MIN,
      UNIT_LIMITS.MOBILITY.MAX,
      "運動性"
    );
    mobility = mobilityResult.value as Integer;
    if (mobilityResult.warning) {
      const lineNumber = findFieldLineNumber(lines, statsLogicalLine, 3);
      warnings.push(
        `[${filePath}] ${name}: ${mobilityResult.warning} (行${lineNumber})`
      );
    }

    // Line: Adaptation, Bitmap
    if (lineIndex >= lines.length) {
      throw new ParseError(
        ERROR_MESSAGES.MISSING_ADAPTATION_LINE,
        statsLogicalLine.endLineNumber,
        ""
      );
    }
    const adaptationLogicalLine = getLogicalLine(lines, lineIndex);
    const adaptationFields = splitByComma(adaptationLogicalLine.content);
    lineIndex = adaptationLogicalLine.endIndex + 1;

    if (adaptationFields.length < 2) {
      throw new ParseError(
        ERROR_MESSAGES.INSUFFICIENT_ADAPTATION_PARAMS,
        adaptationLogicalLine.startLineNumber,
        adaptationLogicalLine.content
      );
    }

    let adaptation = adaptationFields[0];
    let bitmap = adaptationFields[1];

    // Validate adaptation
    const adaptationResult = validateAdaptation(adaptation);
    adaptation = adaptationResult.value;
    if (adaptationResult.warning) {
      const lineNumber = findFieldLineNumber(lines, adaptationLogicalLine, 0);
      warnings.push(
        `[${filePath}] ${name}: ${adaptationResult.warning} (行${lineNumber})`
      );
    }

    // Validate bitmap
    const bitmapResult = validateBitmap(bitmap);
    bitmap = bitmapResult.value;
    if (bitmapResult.warning) {
      const lineNumber = findFieldLineNumber(lines, adaptationLogicalLine, 1);
      warnings.push(
        `[${filePath}] ${name}: ${bitmapResult.warning} (行${lineNumber})`
      );
    }

    // Weapons (until === or end or non-weapon line)
    const weapons: WeaponData[] = [];
    while (lineIndex < lines.length && lines[lineIndex].content !== "===") {
      const line = lines[lineIndex];
      // Check if this might be a new unit name (no commas)
      if (!line.content.includes(",")) {
        break;
      }
      const weaponResult = parseWeapon(lines, lineIndex, filePath);
      if (weaponResult.success) {
        weapons.push(weaponResult.data);
        // Collect weapon warnings
        if (weaponResult.warnings && weaponResult.warnings.length > 0) {
          warnings.push(...weaponResult.warnings);
        }
        lineIndex = weaponResult.nextLineIndex;
      } else {
        // Weapon parsing failed - this is a fatal error
        throw weaponResult.error;
      }
    }

    // Abilities (only if === separator is present)
    const abilities: AbilityData[] = [];
    if (lineIndex < lines.length && lines[lineIndex].content === "===") {
      lineIndex++; // Skip ===

      while (lineIndex < lines.length) {
        const line = lines[lineIndex];
        // Check if this is the start of a new unit (single field, no commas)
        if (!line.content.includes(",")) {
          // Likely a unit name, stop here
          break;
        }
        const abilityResult = parseAbility(lines, lineIndex, filePath);
        if (abilityResult.success) {
          abilities.push(abilityResult.data);
          // Collect ability warnings
          if (abilityResult.warnings && abilityResult.warnings.length > 0) {
            warnings.push(...abilityResult.warnings);
          }
          lineIndex = abilityResult.nextLineIndex;
        } else {
          // Ability parsing failed - this is a fatal error
          throw abilityResult.error;
        }
      }
    }

    // Create UnitData object
    const unit = createUnitData({
      Name: name,
      Nickname: nickname,
      KanaName: kanaName || nickname,
      UnitClass: unitClass,
      PilotCapacity: pilotCapacity,
      NumItemSlots: numItemSlots,
      MovementType: movementType,
      Speed: speed,
      Size: size,
      Cost: cost,
      ExpValue: expValue,
      HP: hp,
      EN: en,
      Armor: armor,
      Mobility: mobility,
      Adaptation: Adaptation.fromString(adaptation),
      Bitmap: bitmap,
      Features: features,
      Weapons: weapons,
      Abilities: abilities,
    });

    return {
      success: true,
      data: { unit, nextLineIndex: lineIndex },
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

/**
 * Parses a weapon data line
 * @param lines - Preprocessed lines array
 * @param lineIndex - Line index for the weapon
 * @param filePath - File path for error messages
 */
function parseWeapon(
  lines: PreprocessedLine[],
  lineIndex: number,
  filePath: string
): ParseResult<WeaponData> & { nextLineIndex: number } {
  try {
    const logicalLine = getLogicalLine(lines, lineIndex);
    const fields = splitByComma(logicalLine.content);
    const warnings: string[] = [];

    if (fields.length < 11) {
      throw new ParseError(
        ERROR_MESSAGES.INSUFFICIENT_WEAPON_PARAMS,
        logicalLine.startLineNumber,
        logicalLine.content
      );
    }

    const name = fields[0];

    const attackPowerResult = parseIntField(fields[1], `${name}の攻撃力`);
    let attackPower = attackPowerResult.value as Integer;
    if (attackPowerResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 1);
      warnings.push(
        `[${filePath}] ${attackPowerResult.warning} (行${lineNumber})`
      );
    }

    const minRangeParse = parseIntField(fields[2], `${name}の最小射程`);
    let minRange = minRangeParse.value as Integer;
    if (minRangeParse.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 2);
      warnings.push(`[${filePath}] ${minRangeParse.warning} (行${lineNumber})`);
    }

    const maxRangeParse = parseIntField(fields[3], `${name}の最大射程`);
    let maxRange = maxRangeParse.value as Integer;
    if (maxRangeParse.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 3);
      warnings.push(`[${filePath}] ${maxRangeParse.warning} (行${lineNumber})`);
    }

    const accuracyModResult = parseIntField(fields[4], `${name}の命中率`);
    let accuracyMod = accuracyModResult.value as Integer;
    if (accuracyModResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 4);
      warnings.push(
        `[${filePath}] ${accuracyModResult.warning} (行${lineNumber})`
      );
    }

    const ammoParse = parseOptionalIntField(fields[5], `${name}の弾数`);
    let ammo = ammoParse.value as Integer;
    if (ammoParse.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 5);
      warnings.push(`[${filePath}] ${ammoParse.warning} (行${lineNumber})`);
    }

    const enCostParse = parseOptionalIntField(fields[6], `${name}の消費EN`);
    let enCost = enCostParse.value as Integer;
    if (enCostParse.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 6);
      warnings.push(`[${filePath}] ${enCostParse.warning} (行${lineNumber})`);
    }

    const requiredMoraleParse = parseOptionalIntField(
      fields[7],
      `${name}の必要気力`
    );
    let requiredMorale = requiredMoraleParse.value as Integer;
    if (requiredMoraleParse.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 7);
      warnings.push(
        `[${filePath}] ${requiredMoraleParse.warning} (行${lineNumber})`
      );
    }

    let adaptation = fields[8];

    const criticalModResult = parseIntField(
      fields[9],
      `${name}のクリティカル率`
    );
    let criticalMod = criticalModResult.value as Integer;
    if (criticalModResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 9);
      warnings.push(
        `[${filePath}] ${criticalModResult.warning} (行${lineNumber})`
      );
    }

    let traits = fields[10] || "";

    // Validate attack power
    const powerResult = validateRange(
      attackPower,
      WEAPON_LIMITS.ATTACK_POWER.MIN,
      WEAPON_LIMITS.ATTACK_POWER.MAX,
      "攻撃力"
    );
    attackPower = powerResult.value as Integer;
    if (powerResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 1);
      warnings.push(
        `[${filePath}] ${name}: ${powerResult.warning} (行${lineNumber})`
      );
    }

    // Validate ranges
    const minRangeResult = validateRange(
      minRange,
      WEAPON_LIMITS.MIN_RANGE.MIN,
      WEAPON_LIMITS.MIN_RANGE.MAX,
      "最小射程"
    );
    minRange = minRangeResult.value as Integer;
    if (minRangeResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 2);
      warnings.push(
        `[${filePath}] ${name}: ${minRangeResult.warning} (行${lineNumber})`
      );
    }

    const maxRangeResult = validateRange(
      maxRange,
      WEAPON_LIMITS.MAX_RANGE.MIN,
      WEAPON_LIMITS.MAX_RANGE.MAX,
      "最大射程"
    );
    maxRange = maxRangeResult.value as Integer;
    if (maxRangeResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 3);
      warnings.push(
        `[${filePath}] ${name}: ${maxRangeResult.warning} (行${lineNumber})`
      );
    }

    // Validate accuracy mod
    const accuracyResult = validateRange(
      accuracyMod,
      WEAPON_LIMITS.ACCURACY_MOD.MIN,
      WEAPON_LIMITS.ACCURACY_MOD.MAX,
      "命中率"
    );
    accuracyMod = accuracyResult.value as Integer;
    if (accuracyResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 4);
      warnings.push(
        `[${filePath}] ${name}: ${accuracyResult.warning} (行${lineNumber})`
      );
    }

    // Validate ammo
    const ammoResult = validateRange(
      ammo,
      WEAPON_LIMITS.AMMO.MIN,
      WEAPON_LIMITS.AMMO.MAX,
      "弾数"
    );
    ammo = ammoResult.value as Integer;
    if (ammoResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 5);
      warnings.push(
        `[${filePath}] ${name}: ${ammoResult.warning} (行${lineNumber})`
      );
    }

    // Validate EN consumption
    const enResult = validateRange(
      enCost,
      WEAPON_LIMITS.EN_COST.MIN,
      WEAPON_LIMITS.EN_COST.MAX,
      "消費EN"
    );
    enCost = enResult.value as Integer;
    if (enResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 6);
      warnings.push(
        `[${filePath}] ${name}: ${enResult.warning} (行${lineNumber})`
      );
    }

    // Validate required morale
    const moraleResult = validateRange(
      requiredMorale,
      WEAPON_LIMITS.REQUIRED_MORALE.MIN,
      WEAPON_LIMITS.REQUIRED_MORALE.MAX,
      "必要気力"
    );
    requiredMorale = moraleResult.value as Integer;
    if (moraleResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 7);
      warnings.push(
        `[${filePath}] ${name}: ${moraleResult.warning} (行${lineNumber})`
      );
    }

    // Validate adaptation
    const adaptationResult = validateAdaptation(adaptation);
    adaptation = adaptationResult.value;
    if (adaptationResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 8);
      warnings.push(
        `[${filePath}] ${name}: ${adaptationResult.warning} (行${lineNumber})`
      );
    }

    // Validate critical mod
    const criticalResult = validateRange(
      criticalMod,
      WEAPON_LIMITS.CRITICAL_MOD.MIN,
      WEAPON_LIMITS.CRITICAL_MOD.MAX,
      "クリティカル率"
    );
    criticalMod = criticalResult.value as Integer;
    if (criticalResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 9);
      warnings.push(
        `[${filePath}] ${name}: ${criticalResult.warning} (行${lineNumber})`
      );
    }

    // Parse optional required condition <...> and required skill (...)
    // Based on VB5 UnitDataList.cls lines 783-809
    // Format: traits [<condition>] [(skill)]
    let requiredCondition = "";
    let requiredSkill = "";

    // Extract required skill (...) first if line ends with ")"
    if (traits.endsWith(")")) {
      // Check for "<condition> (skill)" pattern (look for "> ")
      const condSkillIdx = traits.indexOf("> ");
      if (condSkillIdx > 0) {
        // Extract everything after "> " (includes parentheses)
        const skillWithParens = traits.substring(condSkillIdx + 2);
        // Keep everything up to and including ">"
        traits = traits.substring(0, condSkillIdx + 1).trim();
        // Remove parentheses from skill
        const openParenIdx = skillWithParens.indexOf("(");
        if (openParenIdx >= 0) {
          requiredSkill = skillWithParens
            .substring(openParenIdx + 1, skillWithParens.length - 1)
            .trim();
        }
      } else {
        // Only skill, no condition
        const openParenIdx = traits.lastIndexOf("(");
        if (openParenIdx >= 0) {
          requiredSkill = traits
            .substring(openParenIdx + 1, traits.length - 1)
            .trim();
          traits = traits.substring(0, openParenIdx).trim();
        }
      }
    }

    // Extract required condition <...> if line ends with ">"
    if (traits.endsWith(">")) {
      const openBracketIdx = traits.lastIndexOf("<");
      if (openBracketIdx >= 0) {
        requiredCondition = traits
          .substring(openBracketIdx + 1, traits.length - 1)
          .trim();
        traits = traits.substring(0, openBracketIdx).trim();
      }
    }

    // Validate traits (now cleaned of condition/skill)
    const traitsError = validateTraits(traits, name);
    if (traitsError) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 10);
      warnings.push(`[${filePath}] ${traitsError} (行${lineNumber})`);
    }

    const weapon: WeaponData = {
      Name: name,
      AttackPower: attackPower,
      MinRange: minRange,
      MaxRange: maxRange,
      AccuracyMod: accuracyMod,
      Ammo: ammo,
      ENCost: enCost,
      RequiredMorale: requiredMorale,
      Adaptation: Adaptation.fromString(adaptation),
      CriticalMod: criticalMod,
      Traits: parseTraits(traits),
      RequiredCondition: parseCondition(requiredCondition),
      RequiredSkill: parseSkillRequirement(requiredSkill),
    };

    return {
      success: true,
      data: weapon,
      warnings: warnings.length > 0 ? warnings : undefined,
      nextLineIndex: logicalLine.endIndex + 1,
    };
  } catch (error) {
    return {
      success: false,
      error: error as Error,
      nextLineIndex: lineIndex,
    };
  }
}

/**
 * Parses ability effect string into array of AbilityEffect objects
 * Based on VB5 AbilityData.cls SetEffect method (lines 63-191)
 *
 * @param effectString - Effect string (e.g., "回復Lv3" or "付加=バリアLv2=全 10")
 * @returns Array of AbilityEffect objects
 */
function parseAbilityEffects(effectString: string): AbilityEffect[] {
  const effects: AbilityEffect[] = [];

  // Split by space to get individual effects
  const effectList = effectString.trim().split(/\s+/);

  for (const effectItem of effectList) {
    if (!effectItem) continue;

    let buf = effectItem;
    let effectType = "";
    let effectLevel = 0;
    let effectData = "";

    const lvIndex = buf.indexOf("Lv");
    const eqIndex = buf.indexOf("=");

    if (lvIndex > 0 && (eqIndex === -1 || lvIndex < eqIndex)) {
      // Level specification exists (may include data specification)
      effectType = buf.substring(0, lvIndex);

      if (eqIndex > 0) {
        // Has data specification
        const levelStr = buf.substring(lvIndex + 2, eqIndex);
        effectLevel = parseFloat(levelStr);
        if (isNaN(effectLevel)) {
          effectLevel = 0;
        }

        buf = buf.substring(eqIndex + 1);

        // Remove double quotes if present
        if (buf.startsWith('"') && buf.endsWith('"')) {
          buf = buf.substring(1, buf.length - 1);
        }

        // Parse data part (may have nested Lv/= syntax)
        const dataLvIndex = buf.indexOf("Lv");
        const dataEqIndex = buf.indexOf("=");

        let dataType = "";
        let dataLevel = "";
        let dataValue = "";

        if (
          dataLvIndex > 0 &&
          (dataEqIndex === -1 || dataLvIndex < dataEqIndex)
        ) {
          // Data part has level specification
          dataType = buf.substring(0, dataLvIndex);
          if (dataEqIndex > 0) {
            dataLevel = buf.substring(dataLvIndex + 2, dataEqIndex);
            dataValue = buf.substring(dataEqIndex + 1);
          } else {
            dataLevel = buf.substring(dataLvIndex + 2);
          }
        } else if (dataEqIndex > 0) {
          // Data part has data specification
          dataType = buf.substring(0, dataEqIndex);
          dataValue = buf.substring(dataEqIndex + 1);
        } else {
          // Simple data specification
          dataType = buf;
        }

        effectData = [dataType, dataLevel, dataValue]
          .filter((s) => s)
          .join(" ")
          .trim();
      } else {
        // No data specification
        const levelStr = buf.substring(lvIndex + 2);
        effectLevel = parseFloat(levelStr);
        if (isNaN(effectLevel)) {
          effectLevel = 0;
        }
      }
    } else if (eqIndex > 0) {
      // Data specification exists (no level at top level)
      effectType = buf.substring(0, eqIndex);
      buf = buf.substring(eqIndex + 1);

      // Remove double quotes if present
      if (buf.startsWith('"') && buf.endsWith('"')) {
        buf = buf.substring(1, buf.length - 1);
      }

      // Parse data part
      const dataLvIndex = buf.indexOf("Lv");
      const dataEqIndex = buf.indexOf("=");

      let dataType = "";
      let dataLevel = "";
      let dataValue = "";

      if (effectType === "解説") {
        // Special case: explanation
        dataType = buf;
      } else if (dataLvIndex > 0) {
        // Data part has level specification
        dataType = buf.substring(0, dataLvIndex);
        if (dataEqIndex > 0) {
          dataLevel = buf.substring(dataLvIndex + 2, dataEqIndex);
          dataValue = buf.substring(dataEqIndex + 1);
        } else {
          dataLevel = buf.substring(dataLvIndex + 2);
        }
      } else if (dataEqIndex > 0) {
        // Data part has data specification
        dataType = buf.substring(0, dataEqIndex);
        dataValue = buf.substring(dataEqIndex + 1);
      } else {
        // Simple data specification
        dataType = buf;
      }

      effectData = [dataType, dataLevel, dataValue]
        .filter((s) => s)
        .join(" ")
        .trim();
    } else {
      // Simple effect (no level, no data)
      effectType = buf;
    }

    effects.push({
      EffectType: effectType,
      EffectLevel: toFloat(effectLevel),
      EffectData: effectData,
    });
  }

  return effects;
}

/**
 * Parses ability data line
 * @param lines - Preprocessed lines array
 * @param lineIndex - Line index for the ability
 * @param filePath - File path for error messages
 */
function parseAbility(
  lines: PreprocessedLine[],
  lineIndex: number,
  filePath: string
): ParseResult<AbilityData> & { nextLineIndex: number } {
  try {
    const logicalLine = getLogicalLine(lines, lineIndex);
    const fields = splitByComma(logicalLine.content);
    const warnings: string[] = [];

    if (fields.length < 7) {
      throw new ParseError(
        ERROR_MESSAGES.INSUFFICIENT_ABILITY_PARAMS,
        logicalLine.startLineNumber,
        logicalLine.content
      );
    }

    const name = fields[0];
    const effectString = fields[1];

    const maxRangeResult = parseIntField(fields[2], `${name}の射程`);
    let maxRange = maxRangeResult.value as Integer;
    if (maxRangeResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 2);
      warnings.push(
        `[${filePath}] ${maxRangeResult.warning} (行${lineNumber})`
      );
    }

    const stockParse = parseOptionalIntField(fields[3], `${name}の回数`);
    let stock = stockParse.value as Integer;
    if (stockParse.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 3);
      warnings.push(`[${filePath}] ${stockParse.warning} (行${lineNumber})`);
    }

    const enCostParse = parseOptionalIntField(fields[4], `${name}の消費EN`);
    let enCost = enCostParse.value as Integer;
    if (enCostParse.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 4);
      warnings.push(`[${filePath}] ${enCostParse.warning} (行${lineNumber})`);
    }

    const requiredMoraleParse = parseOptionalIntField(
      fields[5],
      `${name}の必要気力`
    );
    let requiredMorale = requiredMoraleParse.value as Integer;
    if (requiredMoraleParse.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 5);
      warnings.push(
        `[${filePath}] ${requiredMoraleParse.warning} (行${lineNumber})`
      );
    }

    let traits = fields[6] || "";

    // Validate max range
    const rangeResult = validateRange(
      maxRange,
      ABILITY_LIMITS.MAX_RANGE.MIN,
      ABILITY_LIMITS.MAX_RANGE.MAX,
      "射程"
    );
    maxRange = rangeResult.value as Integer;
    if (rangeResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 2);
      warnings.push(
        `[${filePath}] ${name}: ${rangeResult.warning} (行${lineNumber})`
      );
    }

    // Validate stock
    const stockResult = validateRange(
      stock,
      ABILITY_LIMITS.STOCK.MIN,
      ABILITY_LIMITS.STOCK.MAX,
      "回数"
    );
    stock = stockResult.value as Integer;
    if (stockResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 3);
      warnings.push(
        `[${filePath}] ${name}: ${stockResult.warning} (行${lineNumber})`
      );
    }

    // Validate EN consumption
    const enResult = validateRange(
      enCost,
      ABILITY_LIMITS.EN_COST.MIN,
      ABILITY_LIMITS.EN_COST.MAX,
      "消費EN"
    );
    enCost = enResult.value as Integer;
    if (enResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 4);
      warnings.push(
        `[${filePath}] ${name}: ${enResult.warning} (行${lineNumber})`
      );
    }

    // Validate required morale
    const moraleResult = validateRange(
      requiredMorale,
      ABILITY_LIMITS.REQUIRED_MORALE.MIN,
      ABILITY_LIMITS.REQUIRED_MORALE.MAX,
      "必要気力"
    );
    requiredMorale = moraleResult.value as Integer;
    if (moraleResult.warning) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 5);
      warnings.push(
        `[${filePath}] ${name}: ${moraleResult.warning} (行${lineNumber})`
      );
    }

    // Parse effect string into Effects array
    const effects = parseAbilityEffects(effectString);

    // Parse optional required condition <...> and required skill (...)
    // Based on VB5 UnitDataList.cls lines 958-984
    // Format: traits [<condition>] [(skill)]
    let requiredCondition = "";
    let requiredSkill = "";

    // Extract required skill (...) first if line ends with ")"
    if (traits.endsWith(")")) {
      // Check for "<condition> (skill)" pattern (look for "> ")
      const condSkillIdx = traits.indexOf("> ");
      if (condSkillIdx > 0) {
        // Extract everything after "> " (includes parentheses)
        const skillWithParens = traits.substring(condSkillIdx + 2);
        // Keep everything up to and including ">"
        traits = traits.substring(0, condSkillIdx + 1).trim();
        // Remove parentheses from skill
        const openParenIdx = skillWithParens.indexOf("(");
        if (openParenIdx >= 0) {
          requiredSkill = skillWithParens
            .substring(openParenIdx + 1, skillWithParens.length - 1)
            .trim();
        }
      } else {
        // Only skill, no condition
        const openParenIdx = traits.lastIndexOf("(");
        if (openParenIdx >= 0) {
          requiredSkill = traits
            .substring(openParenIdx + 1, traits.length - 1)
            .trim();
          traits = traits.substring(0, openParenIdx).trim();
        }
      }
    }

    // Extract required condition <...> if line ends with ">"
    if (traits.endsWith(">")) {
      const openBracketIdx = traits.lastIndexOf("<");
      if (openBracketIdx >= 0) {
        requiredCondition = traits
          .substring(openBracketIdx + 1, traits.length - 1)
          .trim();
        traits = traits.substring(0, openBracketIdx).trim();
      }
    }

    // Clean up traits
    if (traits === "-") {
      traits = "";
    }

    // Validate traits (now cleaned of condition/skill)
    const traitsError = validateTraits(traits, name);
    if (traitsError) {
      const lineNumber = findFieldLineNumber(lines, logicalLine, 6);
      warnings.push(`[${filePath}] ${traitsError} (行${lineNumber})`);
    }

    const ability: AbilityData = {
      Name: name,
      Stock: stock,
      ENCost: enCost,
      RequiredMorale: requiredMorale,
      MinRange: 0 as Integer,
      MaxRange: maxRange,
      Traits: parseTraits(traits),
      RequiredSkill: parseSkillRequirement(requiredSkill),
      RequiredCondition: parseCondition(requiredCondition),
      Effects: effects,
    };

    return {
      success: true,
      data: ability,
      warnings: warnings.length > 0 ? warnings : undefined,
      nextLineIndex: logicalLine.endIndex + 1,
    };
  } catch (error) {
    return { success: false, error: error as Error, nextLineIndex: lineIndex };
  }
}
