import type { Integer } from "../models/BrandedTypes";
import type { SpecialPower } from "../models/SpecialPower";
import {
  type LogicalLineResult,
  type PreprocessedLine,
  findFieldLineNumber,
  splitByComma,
} from "./lineProcessors";
import { ParseError } from "./ParseResult";
import { parseIntField } from "./utils";
import { validateRange } from "./validators";

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
export function parseSpecialPowerLine(
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
