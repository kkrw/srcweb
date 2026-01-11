import type { WeaponData } from "../models";
import { Adaptation } from "../models/Adaptation";
import type { Integer } from "../models/BrandedTypes";
import { parseCondition } from "../models/Condition";
import { parseSkillRequirement } from "../models/SkillRequirement";
import { parseTraits } from "../models/Trait";
import { WEAPON_LIMITS } from "./constants";
import { ERROR_MESSAGES } from "./messages";
import type { ParseResult } from "./ParseResult";
import type { PreprocessedLine } from "./utils";
import {
  findFieldLineNumber,
  getLogicalLine,
  ParseError,
  parseIntField,
  parseOptionalIntField,
  splitByComma,
} from "./utils";
import {
  validateAdaptation,
  validateRange,
  validateTraits,
} from "./validators";

/**
 * Parses a weapon data line
 * @param lines - Preprocessed lines array
 * @param lineIndex - Line index for the weapon
 * @param filePath - File path for error messages
 */
export function parseWeapon(
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
      name: name,
      attackPower: attackPower,
      minRange: minRange,
      maxRange: maxRange,
      accuracyMod: accuracyMod,
      ammo: ammo,
      enCost: enCost,
      requiredMorale: requiredMorale,
      adaptation: Adaptation.fromString(adaptation),
      criticalMod: criticalMod,
      traits: parseTraits(traits),
      requiredCondition: parseCondition(requiredCondition),
      requiredSkill: parseSkillRequirement(requiredSkill),
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
