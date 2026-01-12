/**
 * Unit Data Parser
 *
 * Parses unit.txt / robot.txt files in SRC format
 */

import {
  type AbilityData,
  type Integer,
  type UnitData,
  type WeaponData,
} from "../models";
import { Adaptation } from "../models/Adaptation";
import type { Feature } from "../models/features/types";
import { createUnitData } from "../models/UnitData";
import { parseAbility } from "./abilityParser.ts";
import { DEFAULTS, UNIT_LIMITS } from "./constants";
import {
  type PreprocessedLine,
  findFieldLineNumber,
  getLogicalLine,
  preprocessLines,
  splitByComma,
} from "./lineProcessors";
import { ERROR_MESSAGES, warningSummary } from "./messages";
import { type ParseResult, ParseError } from "./ParseResult";
import {
  parseUnitFeaturesNewFormat,
  parseUnitFeaturesOldFormat,
} from "./unitFeatureParser";
import { isNumericString, parseIntField } from "./utils";
import {
  validateAdaptation,
  validateBitmap,
  validateRange,
  validateSize,
  validateUnitName,
} from "./validators";
import { parseWeapon } from "./weaponParser";

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
      // Skip empty lines between unit definitions
      while (lineIndex < lines.length && lines[lineIndex].content === "") {
        lineIndex++;
      }
      if (lineIndex >= lines.length) {
        break; // End of file
      }

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
    const features: Feature[] = [];

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
      const result = parseUnitFeaturesNewFormat(
        lines,
        lineIndex,
        filePath,
        name
      );
      features.push(...result.features);
      lineIndex = result.nextLineIndex;
      warnings.push(...result.warnings);
    } else if (featuresHeaderContent.startsWith("特殊能力,")) {
      // Old format: "特殊能力, ability1, ability2, ..."
      const result = parseUnitFeaturesOldFormat(
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
      name: name,
      nickname: nickname,
      kanaName: kanaName || nickname,
      unitClass: unitClass,
      pilotCapacity: pilotCapacity,
      numItemSlots: numItemSlots,
      movementType: movementType,
      speed: speed,
      size: size,
      cost: cost,
      expValue: expValue,
      hp: hp,
      en: en,
      armor: armor,
      mobility: mobility,
      adaptation: Adaptation.fromString(adaptation),
      bitmap: bitmap,
      features: features,
      weapons: weapons,
      abilities: abilities,
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
