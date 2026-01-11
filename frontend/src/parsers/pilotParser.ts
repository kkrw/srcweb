/**
 * Pilot Data Parser
 *
 * Parses pilot.txt files in SRC format
 */

import {
  type AbilityData,
  type Integer,
  type PilotData,
  type SpecialPower,
  type WeaponData,
} from "../models";
import { Adaptation } from "../models/Adaptation";
import type { FeatureAcquisitionData } from "../models/FeatureData";
import type { Feature } from "../models/features/types";
import { createPilotData } from "../models/PilotData";
import { parseAbility } from "./abilityParser.ts";
import { DEFAULTS } from "./constants";
import {
  parseFeature,
  parsePilotSkillsNewFormat,
  parsePilotSkillsOldFormat,
} from "./featureParser";
import type { LogicalLineResult, ParseResult, PreprocessedLine } from "./utils";
import {
  findFieldLineNumber,
  getLogicalLine,
  katakanaToHiragana,
  ParseError,
  parseIntField,
  preprocessLines,
  splitByComma,
} from "./utils";
import {
  validateAdaptation,
  validateBitmap,
  validatePersonality,
  validatePilotName,
  validateRange,
  validateSex,
} from "./validators";
import { parseWeapon } from "./weaponParser";

/**
 * Parses pilot class string into array
 * Based on VB5 PilotDataList.cls lines 256-265
 *
 * @param classStr - Class string (space-separated unit types)
 * @returns Array of unit types
 */
function parsePilotClass(classStr: string): string[] {
  const trimmed = classStr.trim();
  if (trimmed === "" || trimmed === "-") {
    return [];
  }
  // Split by space
  return trimmed.split(/\s+/);
}

/**
 * Parses special power line
 * Based on VB5 PilotDataList.cls lines 754-800
 *
 * Format: "ＳＰ, MaxSP, PowerName, Level, PowerName=Cost, Level, ..."
 *
 * @param lines - Preprocessed lines array (needed for field line number lookup)
 * @param spLine - Logical line result containing the SP line
 * @param filePath - File path for error messages
 * @param pilotName - Pilot name for error messages
 * @returns MaxSP value and array of SpecialPower objects
 */
function parseSpecialPowerLine(
  lines: PreprocessedLine[],
  spLine: LogicalLineResult,
  filePath: string,
  pilotName: string
): {
  maxSP: Integer;
  specialPowers: SpecialPower[];
  warnings: string[];
} {
  const warnings: string[] = [];
  const fields = splitByComma(spLine.content);
  const lineNum = spLine.startLineNumber;

  if (fields.length < 2) {
    throw new ParseError(
      "ＳＰ値の設定が抜けています。",
      lineNum,
      spLine.content
    );
  }

  // First field should be "ＳＰ" or "精神"
  if (fields[0] !== "ＳＰ" && fields[0] !== "精神") {
    throw new ParseError(
      "スペシャルパワーの設定が抜けています。",
      lineNum,
      spLine.content
    );
  }

  // Second field is MaxSP
  const maxSPResult = parseIntField(fields[1], "ＳＰ");
  let maxSP = maxSPResult.value as Integer;
  if (maxSPResult.warning) {
    warnings.push(`[${filePath}] ${maxSPResult.warning} (行${lineNum})`);
    maxSP = 1 as Integer;
  }
  const rangeResult = validateRange(maxSP, 0, 9999, "ＳＰ");
  maxSP = rangeResult.value as Integer;
  if (rangeResult.warning) {
    warnings.push(`[${filePath}] ${rangeResult.warning} (行${lineNum})`);
  }

  // Parse special powers (pairs: name, level)
  const specialPowers: SpecialPower[] = [];
  for (let i = 2; i < fields.length; i += 2) {
    if (i + 1 >= fields.length) {
      const fieldLineNum = findFieldLineNumber(lines, spLine, i);
      warnings.push(
        `[${filePath}] ${pilotName}: スペシャルパワー「${fields[i]}」の獲得レベル指定が抜けています。 (行${fieldLineNum})`
      );
      break;
    }

    let spName = fields[i].trim();
    let customCost: number | undefined;

    // Check for custom SP cost: "PowerName=Cost"
    const eqIndex = spName.indexOf("=");
    if (eqIndex > 0) {
      const costStr = spName.substring(eqIndex + 1);
      customCost = parseInt(costStr, 10);
      spName = spName.substring(0, eqIndex);
    }

    const levelResult = parseIntField(fields[i + 1], `${spName}の獲得レベル`);
    let level = levelResult.value as Integer;
    if (levelResult.warning) {
      // Use findFieldLineNumber to get the correct line number for this field
      const fieldLineNum = findFieldLineNumber(lines, spLine, i + 1);
      warnings.push(
        `[${filePath}] ${pilotName}: スペシャルパワー「${spName}」の獲得レベルが間違っています。 (行${fieldLineNum})`
      );
      level = 1 as Integer;
    }

    specialPowers.push({
      name: spName,
      requiredLevel: level,
      spCost: customCost as Integer | undefined,
    });
  }

  return { maxSP, specialPowers, warnings };
}

/**
 * Parses a pilot data file
 * @param text - File content as string (Shift-JIS decoded to UTF-8)
 * @param filePath - File path for error messages (e.g., "Data/∀ガンダム/pilot.txt")
 */
export function parsePilotFile(
  text: string,
  filePath: string = "unknown"
): ParseResult<PilotData[]> {
  try {
    const lines = preprocessLines(text);
    const pilots: PilotData[] = [];
    const allWarnings: string[] = [];
    let lineIndex = 0;

    while (lineIndex < lines.length) {
      // Skip empty lines between pilot data entries
      while (lineIndex < lines.length && lines[lineIndex].content === "") {
        lineIndex++;
      }
      if (lineIndex >= lines.length) {
        break;
      }
      const result = parsePilotData(lines, lineIndex, filePath);
      if (!result.success) {
        return { success: false, error: result.error, warnings: allWarnings };
      }
      pilots.push(result.data.pilot);
      lineIndex = result.data.nextLineIndex;

      // Collect warnings
      if (result.warnings && result.warnings.length > 0) {
        allWarnings.push(...result.warnings);
      }
    }

    return {
      success: true,
      data: pilots,
      warnings: allWarnings.length > 0 ? allWarnings : undefined,
    };
  } catch (error) {
    if (error instanceof ParseError) {
      return {
        success: false,
        error: error,
      };
    }
    throw error;
  }
}

/**
 * Parses a single pilot data entry
 * Based on VB5 PilotDataList.cls lines 140-907
 *
 * @param lines - Preprocessed lines array
 * @param startLineIndex - Index to start parsing from
 * @param filePath - File path for error messages
 * @returns Parsed pilot data, next line index, and warnings
 */
function parsePilotData(
  lines: PreprocessedLine[],
  startLineIndex: number,
  filePath: string
): ParseResult<{ pilot: PilotData; nextLineIndex: number }> {
  try {
    const warnings: string[] = [];
    let lineIndex = startLineIndex;

    // 1. Name (VB5 lines 156-170)
    if (lineIndex >= lines.length) {
      throw new ParseError("データの終端に到達しました。", 0, "");
    }

    const nameLine = getLogicalLine(lines, lineIndex);
    const name = nameLine.content.trim();

    // Validate name
    const nameError = validatePilotName(name);
    if (nameError) {
      throw new ParseError(nameError, nameLine.startLineNumber, name);
    }

    if (name.includes(",")) {
      throw new ParseError(
        "名称の設定が抜けています。",
        nameLine.startLineNumber,
        name
      );
    }

    lineIndex = nameLine.endIndex + 1;

    // 2. Parameters line (VB5 lines 185-286)
    // 愛称, 読み仮名, 性別, クラス, 地形適応, 経験値
    if (lineIndex >= lines.length) {
      throw new ParseError(
        "設定に抜けがあります。",
        nameLine.startLineNumber,
        name
      );
    }

    const paramsLine = getLogicalLine(lines, lineIndex);
    const paramsFields = splitByComma(paramsLine.content);

    // VB5 counts commas to determine field count (lines 189-202)
    // 3 commas = 4 fields (no KanaName, no Sex)
    // 4 commas = 5 fields (KanaName OR Sex missing)
    // 5 commas = 6 fields (all present)
    if (paramsFields.length < 4) {
      throw new ParseError(
        "設定に抜けがあります。",
        paramsLine.startLineNumber,
        paramsLine.content
      );
    }
    if (paramsFields.length > 6) {
      throw new ParseError(
        "余分な「,」があります。",
        paramsLine.startLineNumber,
        paramsLine.content
      );
    }

    // Nickname (required)
    const nickname = paramsFields[0].trim();
    if (nickname === "") {
      throw new ParseError(
        "愛称の設定が抜けています。",
        paramsLine.startLineNumber,
        paramsLine.content
      );
    }

    // KanaName and Sex parsing (VB5 lines 214-254)
    let kanaName = "";
    let sex = "-";
    let fieldIndex = 1;

    if (paramsFields.length === 4) {
      // No KanaName, no Sex
      kanaName = katakanaToHiragana(nickname); // Default to nickname (converted to Hiragana)
    } else if (paramsFields.length === 5) {
      // Either KanaName or Sex is present
      const field = paramsFields[fieldIndex].trim();
      if (field === "男性" || field === "女性" || field === "-") {
        // This is Sex, no KanaName
        kanaName = katakanaToHiragana(nickname);
        sex = field;
      } else {
        // This is KanaName, no Sex
        kanaName = field;
      }
      fieldIndex++;
    } else {
      // Both KanaName and Sex present
      kanaName = paramsFields[fieldIndex].trim();
      if (kanaName === "男性" || kanaName === "女性" || kanaName === "-") {
        warnings.push(
          `[${filePath}] ${name}: 読み仮名の設定が抜けています。 (行${paramsLine.startLineNumber})`
        );
        sex = kanaName;
        kanaName = katakanaToHiragana(nickname);
      } else {
        fieldIndex++;
        const sexField = paramsFields[fieldIndex].trim();
        const sexResult = validateSex(sexField);
        sex = sexResult.value;
        if (sexResult.warning) {
          warnings.push(
            `[${filePath}] ${name}: ${sexResult.warning} (行${paramsLine.startLineNumber})`
          );
        }
      }
      fieldIndex++;
    }

    // Class (VB5 lines 256-265)
    const classField = paramsFields[fieldIndex].trim();
    const pilotClass = parsePilotClass(classField);
    fieldIndex++;

    // Adaptation (VB5 lines 267-277)
    const adaptationField = paramsFields[fieldIndex].trim();
    let adaptation: Adaptation;
    const adaptResult = validateAdaptation(adaptationField);
    if (adaptResult.warning) {
      warnings.push(
        `[${filePath}] ${name}: ${adaptResult.warning} (行${paramsLine.startLineNumber})`
      );
      adaptation = Adaptation.fromString(DEFAULTS.ADAPTATION);
    } else {
      adaptation = Adaptation.fromString(adaptationField);
    }
    fieldIndex++;

    // ExpValue (VB5 lines 279-286)
    const expValueField = paramsFields[fieldIndex].trim();
    const expResult = parseIntField(expValueField, "経験値");
    let expValue = expResult.value as Integer;
    if (expResult.warning) {
      warnings.push(
        `[${filePath}] ${name}: ${expResult.warning} (行${paramsLine.startLineNumber})`
      );
      expValue = 0 as Integer;
    }
    const expRangeResult = validateRange(expValue, 0, 9999, "経験値");
    expValue = expRangeResult.value as Integer;
    if (expRangeResult.warning) {
      warnings.push(
        `[${filePath}] ${name}: ${expRangeResult.warning} (行${paramsLine.startLineNumber})`
      );
    }

    lineIndex = paramsLine.endIndex + 1;

    // 3. Features (Skills) section (VB5 lines 288-602)
    if (lineIndex >= lines.length) {
      throw new ParseError(
        "特殊能力の設定が抜けています。",
        paramsLine.startLineNumber,
        name
      );
    }

    const skillsLine = getLogicalLine(lines, lineIndex);
    let skills: FeatureAcquisitionData[] = [];

    if (skillsLine.content === "特殊能力なし") {
      // No skills
      lineIndex = skillsLine.endIndex + 1;
    } else if (skillsLine.content === "特殊能力") {
      // New format (multiple lines)
      lineIndex = skillsLine.endIndex + 1;
      const skillsResult = parsePilotSkillsNewFormat(
        lines,
        lineIndex,
        filePath,
        name
      );
      skills = skillsResult.skills;
      warnings.push(...skillsResult.warnings);
      lineIndex = skillsResult.nextLineIndex;
    } else if (skillsLine.content.startsWith("特殊能力,")) {
      // Old format (single line)
      const skillsResult = parsePilotSkillsOldFormat(
        lines,
        skillsLine,
        filePath,
        name
      );
      skills = skillsResult.skills;
      warnings.push(...skillsResult.warnings);
      lineIndex = skillsLine.endIndex + 1;
    } else {
      throw new ParseError(
        "特殊能力の設定が抜けています。",
        skillsLine.startLineNumber,
        skillsLine.content
      );
    }

    // 4. Stats line (VB5 lines 604-714)
    // 格闘, 射撃, 命中, 回避, 技量, 反応, 性格
    if (lineIndex >= lines.length) {
      throw new ParseError(
        "格闘攻撃力の設定が抜けています。",
        skillsLine.startLineNumber,
        name
      );
    }

    const statsLine = getLogicalLine(lines, lineIndex);
    const statsFields = splitByComma(statsLine.content);

    if (statsFields.length < 7) {
      throw new ParseError(
        "設定に抜けがあります。",
        statsLine.startLineNumber,
        statsLine.content
      );
    }

    // Parse stats
    const meleeResult = parseIntField(statsFields[0], "格闘攻撃力");
    const meleeAtk = validateRange(meleeResult.value, 0, 9999, "格闘攻撃力")
      .value as Integer;
    if (meleeResult.warning) {
      warnings.push(
        `[${filePath}] ${name}: ${meleeResult.warning} (行${statsLine.startLineNumber})`
      );
    }

    const rangedResult = parseIntField(statsFields[1], "射撃攻撃力");
    const rangedAtk = validateRange(rangedResult.value, 0, 9999, "射撃攻撃力")
      .value as Integer;
    if (rangedResult.warning) {
      warnings.push(
        `[${filePath}] ${name}: ${rangedResult.warning} (行${statsLine.startLineNumber})`
      );
    }

    const accuracyResult = parseIntField(statsFields[2], "命中");
    const accuracy = validateRange(accuracyResult.value, 0, 9999, "命中")
      .value as Integer;
    if (accuracyResult.warning) {
      warnings.push(
        `[${filePath}] ${name}: ${accuracyResult.warning} (行${statsLine.startLineNumber})`
      );
    }

    const evasionResult = parseIntField(statsFields[3], "回避");
    const evasion = validateRange(evasionResult.value, 0, 9999, "回避")
      .value as Integer;
    if (evasionResult.warning) {
      warnings.push(
        `[${filePath}] ${name}: ${evasionResult.warning} (行${statsLine.startLineNumber})`
      );
    }

    const techniqueResult = parseIntField(statsFields[4], "技量");
    const technique = validateRange(techniqueResult.value, 0, 9999, "技量")
      .value as Integer;
    if (techniqueResult.warning) {
      warnings.push(
        `[${filePath}] ${name}: ${techniqueResult.warning} (行${statsLine.startLineNumber})`
      );
    }

    const agilityResult = parseIntField(statsFields[5], "反応");
    const agility = validateRange(agilityResult.value, 0, 9999, "反応")
      .value as Integer;
    if (agilityResult.warning) {
      warnings.push(
        `[${filePath}] ${name}: ${agilityResult.warning} (行${statsLine.startLineNumber})`
      );
    }

    // Personality
    const personalityField = statsFields[6].trim();
    const personalityResult = validatePersonality(personalityField);
    const personality = personalityResult.value;
    if (personalityResult.warning) {
      warnings.push(
        `[${filePath}] ${name}: ${personalityResult.warning} (行${statsLine.startLineNumber})`
      );
    }

    lineIndex = statsLine.endIndex + 1;

    // 5. SP line (VB5 lines 716-800)
    if (lineIndex >= lines.length) {
      throw new ParseError(
        "スペシャルパワーの設定が抜けています。",
        statsLine.startLineNumber,
        name
      );
    }

    const spLine = getLogicalLine(lines, lineIndex);
    let maxSP = 0 as Integer;
    let specialPowers: SpecialPower[] = [];

    if (spLine.content === "ＳＰなし" || spLine.content === "精神なし") {
      // No special powers
    } else if (spLine.content === "") {
      throw new ParseError(
        "スペシャルパワーの設定が抜けています。",
        spLine.startLineNumber,
        spLine.content
      );
    } else {
      const spResult = parseSpecialPowerLine(lines, spLine, filePath, name);
      maxSP = spResult.maxSP;
      specialPowers = spResult.specialPowers;
      warnings.push(...spResult.warnings);
    }

    lineIndex = spLine.endIndex + 1;

    // 6. Media line (Bitmap, MIDI) (VB5 lines 802-842)
    if (lineIndex >= lines.length) {
      throw new ParseError(
        "ビットマップの設定が抜けています。",
        spLine.startLineNumber,
        name
      );
    }

    const mediaLine = getLogicalLine(lines, lineIndex);
    const mediaFields = splitByComma(mediaLine.content);

    if (mediaFields.length < 2) {
      throw new ParseError(
        "ＭＩＤＩの設定が抜けています。",
        mediaLine.startLineNumber,
        mediaLine.content
      );
    }

    // Bitmap
    const bitmapField = mediaFields[0].trim();
    let bitmap = bitmapField;
    let isBitmapMissing = false;
    const bitmapResult = validateBitmap(bitmapField);
    if (bitmapResult.warning) {
      warnings.push(
        `[${filePath}] ${name}: ${bitmapResult.warning} (行${mediaLine.startLineNumber})`
      );
      isBitmapMissing = true;
      bitmap = "-.bmp";
    }

    // BGM (MIDI)
    const bgmField = mediaFields[1].trim();
    const bgm = bgmField.split(" ");
    bgm.map((f) => {
      // VB5 validates extension: .mid, .mp3, .wav, or "-"
      const bgmLower = f.toLowerCase().replace(/\)+$/, ""); // Remove trailing ")"
      if (
        bgmLower.endsWith(".mid") ||
        bgmLower.endsWith(".mp3") ||
        bgmLower.endsWith(".wav") ||
        bgmField === "-"
      ) {
        return f;
      } else {
        if (bgmField === "") {
          warnings.push(
            `[${filePath}] ${name}: ＭＩＤＩの設定が抜けています。 (行${mediaLine.startLineNumber})`
          );
        } else {
          warnings.push(
            `[${filePath}] ${name}: ＭＩＤＩの設定が間違っています。 (行${mediaLine.startLineNumber})`
          );
        }
        return DEFAULTS.BGM_FILE;
      }
    });

    lineIndex = mediaLine.endIndex + 1;

    // 7. Optional sections after "===" (VB5 lines 851-907)
    const features: Feature[] = [];
    const weapons: WeaponData[] = [];
    const abilities: AbilityData[] = [];

    // Check if next line is "==="
    if (lineIndex < lines.length) {
      const separatorLine = getLogicalLine(lines, lineIndex);
      if (separatorLine.content === "===") {
        lineIndex = separatorLine.endIndex + 1;

        // Parse unit features (VB5 lines 855-907)
        if (lineIndex < lines.length) {
          const featuresStartLine = getLogicalLine(lines, lineIndex);
          if (featuresStartLine.content !== "===") {
            // Parse features until "===" or next pilot name
            let featureLineIndex = lineIndex;
            while (featureLineIndex < lines.length) {
              const featureLine = getLogicalLine(lines, featureLineIndex);
              if (featureLine.content === "===" || featureLine.content === "") {
                break;
              }

              // Parse features from this line
              const featureFields = splitByComma(featureLine.content);
              for (const featureText of featureFields) {
                const trimmed = featureText.trim();
                if (trimmed !== "") {
                  const feature = parseFeature(trimmed);
                  features.push(feature);
                }
              }

              featureLineIndex = featureLine.endIndex + 1;
            }
            lineIndex = featureLineIndex;
          }
        }

        // Check for next "===" for weapons
        if (lineIndex < lines.length) {
          const weaponSeparatorLine = getLogicalLine(lines, lineIndex);
          if (weaponSeparatorLine.content === "===") {
            lineIndex = weaponSeparatorLine.endIndex + 1;

            // Parse weapons (VB5 lines 913-1033)
            while (lineIndex < lines.length) {
              const weaponLine = getLogicalLine(lines, lineIndex);
              if (weaponLine.content === "===" || weaponLine.content === "") {
                break;
              }

              const weaponResult = parseWeapon(lines, lineIndex, filePath);
              if (!weaponResult.success) {
                return weaponResult as ParseResult<{
                  pilot: PilotData;
                  nextLineIndex: number;
                }>;
              }
              weapons.push(weaponResult.data);
              warnings.push(...(weaponResult.warnings || []));
              lineIndex = weaponResult.nextLineIndex;
            }
          }
        }

        // Check for next "===" for abilities
        if (lineIndex < lines.length) {
          const abilitySeparatorLine = getLogicalLine(lines, lineIndex);
          if (abilitySeparatorLine.content === "===") {
            lineIndex = abilitySeparatorLine.endIndex + 1;

            // Parse abilities (VB5 lines similar to weapons)
            while (lineIndex < lines.length) {
              const abilityLine = getLogicalLine(lines, lineIndex);
              if (abilityLine.content === "===" || abilityLine.content === "") {
                break;
              }

              const abilityResult = parseAbility(lines, lineIndex, filePath);
              if (!abilityResult.success) {
                return abilityResult as ParseResult<{
                  pilot: PilotData;
                  nextLineIndex: number;
                }>;
              }
              abilities.push(abilityResult.data);
              warnings.push(...(abilityResult.warnings || []));
              lineIndex = abilityResult.nextLineIndex;
            }
          }
        }
      }
    }

    // Create pilot data
    const pilot = createPilotData({
      name: name,
      nickname: nickname,
      kanaName: kanaName,
      sex: sex,
      availableUnitClasses: pilotClass,
      adaptation: adaptation,
      expValue: expValue,
      meleeAtk: meleeAtk,
      rangedAtk: rangedAtk,
      accuracy: accuracy,
      evasion: evasion,
      agility: agility,
      technique: technique,
      personality: personality,
      sp: maxSP,
      bgmFiles: bgm,
      faceGraphicFile: bitmap,
      isBitmapMissing: isBitmapMissing,
      specialPowers: specialPowers,
      features: skills,
      unitFeatures: features,
      weapons: weapons,
      abilities: abilities,
    });

    return {
      success: true,
      data: { pilot, nextLineIndex: lineIndex },
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    if (error instanceof ParseError) {
      return {
        success: false,
        error: error,
      };
    }
    throw error;
  }
}
