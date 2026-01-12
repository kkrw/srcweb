/**
 * Terrain Data Parser
 *
 * Parses terrain.txt files in SRC format
 *
 * Terrain data format:
 * - Line 1: Terrain ID (0-1999)
 * - Line 2: Name, GraphicFileNamePrefix
 * - Line 3: TerrainType, MoveCost, EvasionBonus, DamageReduction
 * - Lines 4+: Terrain features (optional, until empty line)
 * - Empty line separates terrain entries
 *
 * Comments:
 * - Lines starting with # are ignored
 * - Text after // is ignored
 * - Line continuation with _ at end of line
 */

import type { Float, Integer } from "../models/BrandedTypes";
import { type TERRAIN_TYPE, TERRAIN_TYPES } from "../models/map/constants";
import type { Terrain, TerrainFeature } from "../models/map/types";
import {
  type PreprocessedLine,
  getLogicalLine,
  preprocessLines,
  splitByComma,
} from "./lineProcessors";
import { ERROR_MESSAGES, warningSummary } from "./messages";
import { type ParseResult, ParseError } from "./ParseResult";

/** Terrain ID range */
const TERRAIN_ID_MIN = 0;
const TERRAIN_ID_MAX = 1999;

/** Value for impassable terrain (wall) */
const IMPASSABLE_COST = -1;

/**
 * Parses a terrain data file
 * @param text - File content as string (Shift-JIS decoded to UTF-8)
 * @param filePath - File path for error messages (e.g., "Data/System/terrain.txt")
 */
export function parseTerrainFile(
  text: string,
  filePath: string = "unknown"
): ParseResult<Terrain[]> {
  try {
    const lines = preprocessLines(text);
    const terrains: Terrain[] = [];
    const allWarnings: string[] = [];
    let lineIndex = 0;

    while (lineIndex < lines.length) {
      // Skip empty lines between terrain definitions
      while (lineIndex < lines.length && lines[lineIndex].content === "") {
        lineIndex++;
      }
      if (lineIndex >= lines.length) {
        break; // End of file
      }

      const result = parseTerrainData(lines, lineIndex, filePath);
      if (!result.success) {
        return { success: false, error: result.error, warnings: allWarnings };
      }
      terrains.push(result.data.terrain);
      lineIndex = result.data.nextLineIndex;

      // Collect warnings
      if (result.warnings && result.warnings.length > 0) {
        allWarnings.push(...result.warnings);
      }
    }

    if (terrains.length === 0) {
      return {
        success: false,
        error: new ParseError(ERROR_MESSAGES.TERRAIN_FILE_EMPTY, 1, ""),
      };
    }

    // TODO: Display warnings to user via UI dialog instead of console
    if (allWarnings.length > 0) {
      console.warn(
        `[${filePath}] ${warningSummary(
          allWarnings.length
        )}：\n${allWarnings.join("\n")}`
      );
    }

    return {
      success: true,
      data: terrains,
      warnings: allWarnings.length > 0 ? allWarnings : undefined,
    };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

/**
 * Internal result type for parsing a single terrain entry
 */
type ParseTerrainResult = ParseResult<{
  terrain: Terrain;
  nextLineIndex: number;
}>;

/**
 * Parses a single terrain data entry
 * @param lines - Preprocessed lines
 * @param startIndex - Starting line index
 * @param filePath - File path for error messages
 */
function parseTerrainData(
  lines: PreprocessedLine[],
  startIndex: number,
  filePath: string
): ParseTerrainResult {
  try {
    let lineIndex = startIndex;
    const warnings: string[] = [];

    // Line 1: Terrain ID
    if (lineIndex >= lines.length) {
      const lastLineNum =
        lines.length > 0 ? lines[lines.length - 1].lineNumber : 1;
      throw new ParseError(ERROR_MESSAGES.UNEXPECTED_EOF, lastLineNum, "");
    }

    const idLogicalLine = getLogicalLine(lines, lineIndex);
    const idStr = idLogicalLine.content.trim();
    lineIndex = idLogicalLine.endIndex + 1;

    // Check if this is a separator line (e.g., "=======自然地=======")
    if (idStr.startsWith("=")) {
      // Skip separator lines - treat as a special terrain with dummy values
      // but still parse the following lines
    }

    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      throw new ParseError(
        `${ERROR_MESSAGES.TERRAIN_INVALID_ID}: ${idStr}`,
        idLogicalLine.startLineNumber,
        idStr
      );
    }

    if (id < TERRAIN_ID_MIN || id > TERRAIN_ID_MAX) {
      warnings.push(
        `[${filePath}] 地形番号${id}: ${ERROR_MESSAGES.TERRAIN_ID_OUT_OF_RANGE} (行${idLogicalLine.startLineNumber})`
      );
    }

    // Line 2: Name, GraphicFileNamePrefix
    if (lineIndex >= lines.length) {
      throw new ParseError(
        ERROR_MESSAGES.TERRAIN_MISSING_NAME_LINE,
        idLogicalLine.endLineNumber,
        ""
      );
    }

    const nameLogicalLine = getLogicalLine(lines, lineIndex);
    const nameFields = splitByComma(nameLogicalLine.content);
    lineIndex = nameLogicalLine.endIndex + 1;

    if (nameFields.length < 2) {
      throw new ParseError(
        ERROR_MESSAGES.TERRAIN_INVALID_NAME_FORMAT,
        nameLogicalLine.startLineNumber,
        nameLogicalLine.content
      );
    }

    const name = nameFields[0].trim();
    const graphicFileNamePrefix = nameFields[1].trim();

    // Line 3: TerrainType, MoveCost, EvasionBonus, DamageReduction
    if (lineIndex >= lines.length) {
      throw new ParseError(
        ERROR_MESSAGES.TERRAIN_MISSING_TYPE_LINE,
        nameLogicalLine.endLineNumber,
        ""
      );
    }

    const typeLogicalLine = getLogicalLine(lines, lineIndex);
    const typeFields = splitByComma(typeLogicalLine.content);
    lineIndex = typeLogicalLine.endIndex + 1;

    if (typeFields.length < 4) {
      throw new ParseError(
        ERROR_MESSAGES.TERRAIN_INVALID_TYPE_FORMAT,
        typeLogicalLine.startLineNumber,
        typeLogicalLine.content
      );
    }

    const terrainTypeStr = typeFields[0].trim();
    if (!isValidTerrainType(terrainTypeStr)) {
      throw new ParseError(
        `${ERROR_MESSAGES.TERRAIN_INVALID_TYPE}: ${terrainTypeStr}`,
        typeLogicalLine.startLineNumber,
        typeLogicalLine.content
      );
    }
    const terrainType = terrainTypeStr as TERRAIN_TYPE;

    // Parse move cost (can be "-" for impassable)
    const costStr = typeFields[1].trim();
    let cost: Float;
    if (costStr === "-") {
      cost = IMPASSABLE_COST as Float;
    } else {
      const costValue = parseFloat(costStr);
      if (isNaN(costValue)) {
        warnings.push(
          `[${filePath}] 地形番号${id}: ${ERROR_MESSAGES.TERRAIN_INVALID_COST}: ${costStr} (行${typeLogicalLine.startLineNumber})`
        );
        cost = 1 as Float;
      } else {
        cost = costValue as Float;
      }
    }

    // Parse evasion bonus
    const evasionStr = typeFields[2].trim();
    const evasionValue = parseInt(evasionStr, 10);
    let evasionBonusRate: Float | undefined;
    if (isNaN(evasionValue)) {
      warnings.push(
        `[${filePath}] 地形番号${id}: ${ERROR_MESSAGES.TERRAIN_INVALID_EVASION}: ${evasionStr} (行${typeLogicalLine.startLineNumber})`
      );
    } else if (evasionValue !== 0) {
      evasionBonusRate = evasionValue as Float;
    }

    // Parse damage reduction
    const damageStr = typeFields[3].trim();
    const damageValue = parseInt(damageStr, 10);
    let defenseBonusRate: Float | undefined;
    if (isNaN(damageValue)) {
      warnings.push(
        `[${filePath}] 地形番号${id}: ${ERROR_MESSAGES.TERRAIN_INVALID_DAMAGE}: ${damageStr} (行${typeLogicalLine.startLineNumber})`
      );
    } else if (damageValue !== 0) {
      defenseBonusRate = damageValue as Float;
    }

    // Lines 4+: Terrain features (until empty line or next terrain ID)
    const features: TerrainFeature[] = [];
    let hideInEditor = false;

    while (lineIndex < lines.length && lines[lineIndex].content !== "") {
      const featureLogicalLine = getLogicalLine(lines, lineIndex);
      const featureContent = featureLogicalLine.content.trim();

      // Check if this line looks like a terrain ID (start of next terrain)
      if (/^\d+$/.test(featureContent) || featureContent.startsWith("=")) {
        // This is the next terrain entry, don't consume this line
        break;
      }

      const featureResult = parseTerrainFeature(featureContent);
      if (featureResult) {
        if (featureResult.isHideInEditor) {
          hideInEditor = true;
        } else {
          features.push(featureResult.feature);
        }
      }

      lineIndex = featureLogicalLine.endIndex + 1;
    }

    const terrain: Terrain = {
      id: id as Integer,
      name,
      graphicFileNamePrefix,
      type: terrainType,
      cost,
      features,
    };

    if (evasionBonusRate !== undefined) {
      terrain.evasionBonusRate = evasionBonusRate;
    }
    if (defenseBonusRate !== undefined) {
      terrain.defenseBonusRate = defenseBonusRate;
    }
    if (hideInEditor) {
      terrain.hideInEditor = true;
    }

    return {
      success: true,
      data: { terrain, nextLineIndex: lineIndex },
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

/**
 * Checks if a string is a valid terrain type
 */
function isValidTerrainType(str: string): str is TERRAIN_TYPE {
  return (TERRAIN_TYPES as readonly string[]).includes(str);
}

/**
 * Parses a terrain feature string
 * @param featureText - Feature text (e.g., "ＨＰ回復Lv1", "衝突", "エディタ非表示")
 * @returns Parsed feature or null if invalid, plus flag for hideInEditor
 */
function parseTerrainFeature(
  featureText: string
): { feature: TerrainFeature; isHideInEditor?: boolean } | null {
  const text = featureText.trim();
  if (text === "") {
    return null;
  }

  // Check for "エディタ非表示" special feature
  if (text === "エディタ非表示") {
    return {
      feature: {
        spec: { name: "エディタ非表示", effects: [] },
        level: 0 as Float,
        parameters: [],
      },
      isHideInEditor: true,
    };
  }

  // Parse feature name, level, and parameters
  // Format: FeatureName[Lv#][=Parameter]
  // Examples: "ＨＰ回復Lv1", "衝突", "状態付加Lv3=毒", "適用範囲=地上"
  let featureName = text;
  let level: Float = 0 as Float;
  const parameters: string[] = [];

  // Check for "=" parameter
  const eqIndex = text.indexOf("=");
  if (eqIndex > 0) {
    const paramPart = text.substring(eqIndex + 1).trim();
    parameters.push(paramPart);
    featureName = text.substring(0, eqIndex).trim();
  }

  // Check for "Lv" level
  const lvIndex = featureName.indexOf("Lv");
  if (lvIndex > 0) {
    const levelStr = featureName.substring(lvIndex + 2).trim();
    const levelValue = parseFloat(levelStr);
    if (!isNaN(levelValue)) {
      level = levelValue as Float;
    }
    featureName = featureName.substring(0, lvIndex).trim();
  }

  return {
    feature: {
      spec: { name: featureName, effects: [] },
      level,
      parameters,
    },
  };
}
