import { toFloat } from "../models";
import type { AbilityData, AbilityEffect } from "../models/AbilityData";
import type { Integer } from "../models/BrandedTypes";
import { parseCondition } from "../models/Condition";
import { parseSkillRequirement } from "../models/SkillRequirement";
import { parseTraits } from "../models/Trait";
import { ABILITY_LIMITS } from "./constants";
import {
  type PreprocessedLine,
  findFieldLineNumber,
  getLogicalLine,
  splitByComma,
} from "./lineProcessors";
import { ERROR_MESSAGES } from "./messages";
import type { ParseResult } from "./ParseResult";
import { ParseError } from "./ParseResult";
import { parseIntField, parseOptionalIntField } from "./utils";
import { validateRange, validateTraits } from "./validators";

/**
 * Splits effect string by spaces, but respects double-quoted sections.
 * Quoted sections are kept together even if they contain spaces.
 *
 * @param str - Effect string to split
 * @returns Array of individual effect strings
 */
function splitEffectString(str: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === " " && !inQuotes) {
      if (current.trim()) {
        result.push(current.trim());
      }
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result;
}

/**
 * Parses ability effect string into array of AbilityEffect objects
 * Based on VB5 AbilityData.cls SetEffect method (lines 63-191)
 *
 * @param effectString - Effect string (e.g., "回復Lv3" or "付加=バリアLv2=全 10")
 * @returns Array of AbilityEffect objects
 */
export function parseAbilityEffects(effectString: string): AbilityEffect[] {
  const effects: AbilityEffect[] = [];

  // Split by space to get individual effects, respecting double quotes
  const effectList = splitEffectString(effectString.trim());

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

        // Keep the data as-is (preserve original format like "バリアLv500=念動バリア")
        effectData = buf;
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

      // Keep the data as-is (preserve original format)
      effectData = buf;
    } else {
      // Simple effect (no level, no data)
      effectType = buf;
    }

    effects.push({
      effectType: effectType,
      effectLevel: toFloat(effectLevel),
      effectData: effectData,
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
export function parseAbility(
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
      name: name,
      stock: stock,
      enCost: enCost,
      requiredMorale: requiredMorale,
      minRange: 0 as Integer,
      maxRange: maxRange,
      traits: parseTraits(traits),
      requiredSkill: parseSkillRequirement(requiredSkill),
      requiredCondition: parseCondition(requiredCondition),
      effects: effects,
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
