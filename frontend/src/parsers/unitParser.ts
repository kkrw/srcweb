/**
 * Unit Data Parser
 *
 * Parses unit.txt / robot.txt files in SRC format
 */

import type { UnitData, WeaponData, AbilityData, FeatureData } from '../models';
import { createUnitData } from '../models/UnitData';
import {
  preprocessLines,
  splitByComma,
  removeQuotes,
  parseIntField,
  isNoValue,
  parseAdaptation,
  ParseError,
} from './utils';

/**
 * Result type for parsing operations
 */
export type ParseResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: Error;
};

/**
 * Parses a unit data file
 */
export function parseUnitFile(text: string): ParseResult<UnitData[]> {
  try {
    const lines = preprocessLines(text);
    const units: UnitData[] = [];
    let lineIndex = 0;

    while (lineIndex < lines.length) {
      const result = parseUnitData(lines, lineIndex);
      if (!result.success) {
        return result;
      }
      units.push(result.data.unit);
      lineIndex = result.data.nextLineIndex;
    }

    return { success: true, data: units };
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
 */
function parseUnitData(lines: string[], startIndex: number): ParseUnitResult {
  try {
    let lineIndex = startIndex;

    // Line 1: Name
    if (lineIndex >= lines.length) {
      throw new ParseError('Unexpected end of file', lineIndex, '');
    }
    const name = lines[lineIndex++];

    // Line 2: Nickname, [KanaName,] UnitClass, PilotCapacity, NumItemSlots
    if (lineIndex >= lines.length) {
      throw new ParseError('Missing unit parameters line', lineIndex, '');
    }
    const paramsLine = lines[lineIndex++];
    const params = splitByComma(paramsLine);

    if (params.length < 4) {
      throw new ParseError(
        'Insufficient parameters (expected at least 4)',
        lineIndex - 1,
        paramsLine
      );
    }

    const nickname = params[0];
    let kanaName: string;
    let unitClass: string;
    let pilotCapacity: number;
    let numItemSlots: number;

    if (params.length === 4) {
      // No KanaName specified
      kanaName = '';
      unitClass = params[1];
      pilotCapacity = parseIntField(params[2]);
      numItemSlots = parseIntField(params[3]);
    } else if (params.length >= 5) {
      // KanaName specified
      kanaName = params[1];
      unitClass = params[2];
      pilotCapacity = parseIntField(params[3]);
      numItemSlots = parseIntField(params[4]);
    } else {
      throw new ParseError('Invalid parameters line', lineIndex - 1, paramsLine);
    }

    // Handle parentheses in PilotCapacity (special behavior)
    if (params[params.length - 2].startsWith('(')) {
      // This is a complex case, for now just parse the number
      const numStr = params[params.length - 2].replace(/[()]/g, '');
      pilotCapacity = -Math.abs(parseIntField(numStr)); // Negative indicates special behavior
    }

    // Line 3: MovementType, Speed, Size, Cost, ExpValue
    if (lineIndex >= lines.length) {
      throw new ParseError('Missing movement parameters line', lineIndex, '');
    }
    const movementLine = lines[lineIndex++];
    const movementParams = splitByComma(movementLine);

    if (movementParams.length < 5) {
      throw new ParseError(
        'Insufficient movement parameters',
        lineIndex - 1,
        movementLine
      );
    }

    const movementType = movementParams[0];
    const speed = parseIntField(movementParams[1]);
    const size = movementParams[2];
    const cost = parseIntField(movementParams[3]);
    const expValue = parseIntField(movementParams[4]);

    // Line 4+: Special abilities (until we find HP line)
    const features: FeatureData[] = [];

    if (lineIndex >= lines.length) {
      throw new ParseError('Missing special abilities section', lineIndex, '');
    }

    const featuresHeaderLine = lines[lineIndex++];
    if (featuresHeaderLine === '特殊能力なし') {
      // No special abilities
    } else if (featuresHeaderLine.startsWith('特殊能力')) {
      // New format: multiple lines of abilities
      while (lineIndex < lines.length) {
        const line = lines[lineIndex];
        // Check if this is the HP/EN line (all numeric fields)
        const fields = splitByComma(line);
        if (fields.length === 4 && fields.every((f) => !isNaN(parseIntField(f)))) {
          // This is the HP/EN/Armor/Mobility line
          break;
        }
        // Parse feature line
        // TODO: Implement feature parsing
        lineIndex++;
      }
    } else {
      // Old format: "特殊能力, ability1, ability2, ..."
      const abilityFields = splitByComma(featuresHeaderLine);
      if (abilityFields[0] === '特殊能力') {
        // Parse abilities from this line
        // TODO: Implement feature parsing
      } else {
        throw new ParseError(
          'Invalid special abilities format',
          lineIndex - 1,
          featuresHeaderLine
        );
      }
    }

    // Line: HP, EN, Armor, Mobility
    if (lineIndex >= lines.length) {
      throw new ParseError('Missing HP/EN/Armor/Mobility line', lineIndex, '');
    }
    const statsLine = lines[lineIndex++];
    const stats = splitByComma(statsLine);

    if (stats.length < 4) {
      throw new ParseError('Insufficient stats parameters', lineIndex - 1, statsLine);
    }

    const hp = parseIntField(stats[0]);
    const en = parseIntField(stats[1]);
    const armor = parseIntField(stats[2]);
    const mobility = parseIntField(stats[3]);

    // Line: Adaptation, Bitmap
    if (lineIndex >= lines.length) {
      throw new ParseError('Missing adaptation/bitmap line', lineIndex, '');
    }
    const adaptationLine = lines[lineIndex++];
    const adaptationFields = splitByComma(adaptationLine);

    if (adaptationFields.length < 2) {
      throw new ParseError(
        'Insufficient adaptation/bitmap parameters',
        lineIndex - 1,
        adaptationLine
      );
    }

    const adaptation = parseAdaptation(adaptationFields[0]);
    const bitmap = adaptationFields[1];

    // Weapons (until === or end or non-weapon line)
    const weapons: WeaponData[] = [];
    while (lineIndex < lines.length && lines[lineIndex] !== '===') {
      const line = lines[lineIndex];
      // Check if this might be a new unit name (no commas)
      if (!line.includes(',')) {
        break;
      }
      const weaponResult = parseWeapon(line, lineIndex);
      if (weaponResult.success) {
        weapons.push(weaponResult.data);
        lineIndex++;
      } else {
        // Not a valid weapon, stop weapon parsing
        break;
      }
    }

    // Abilities (only if === separator is present)
    const abilities: AbilityData[] = [];
    if (lineIndex < lines.length && lines[lineIndex] === '===') {
      lineIndex++; // Skip ===

      while (lineIndex < lines.length) {
        const line = lines[lineIndex];
        // Check if this is the start of a new unit (single field, no commas)
        if (!line.includes(',')) {
          // Likely a unit name, stop here
          break;
        }
        const abilityResult = parseAbility(line, lineIndex);
        if (abilityResult.success) {
          abilities.push(abilityResult.data);
          lineIndex++;
        } else {
          // Not a valid ability, might be next unit's data
          break;
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
      Adaptation: adaptation,
      Bitmap: bitmap,
      Features: features,
      Weapons: weapons,
      Abilities: abilities,
    });

    return { success: true, data: { unit, nextLineIndex: lineIndex } };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

/**
 * Parses a weapon data line
 */
function parseWeapon(line: string, lineNumber: number): ParseResult<WeaponData> {
  try {
    const fields = splitByComma(line);

    if (fields.length < 11) {
      throw new ParseError('Insufficient weapon parameters', lineNumber, line);
    }

    const name = fields[0];
    const attackPower = parseIntField(fields[1]);
    const minRange = parseIntField(fields[2]);
    const maxRange = parseIntField(fields[3]);
    const accuracyMod = parseIntField(fields[4]);
    const ammo = isNoValue(fields[5]) ? 0 : parseIntField(fields[5]);
    const enCost = isNoValue(fields[6]) ? 0 : parseIntField(fields[6]);
    const requiredMorale = isNoValue(fields[7]) ? 0 : parseIntField(fields[7]);
    const adaptation = parseAdaptation(fields[8]);
    const criticalMod = parseIntField(fields[9]);
    const traits = fields[10];

    // TODO: Parse optional <conditions> and (requirements) from fields[11+]
    let requiredCondition = '';
    let requiredSkill = '';

    const weapon: WeaponData = {
      Name: name,
      AttackPower: attackPower,
      MinRange: minRange,
      MaxRange: maxRange,
      AccuracyMod: accuracyMod,
      Ammo: ammo,
      ENConsumption: enCost,
      RequiredMorale: requiredMorale,
      Adaptation: adaptation,
      CriticalMod: criticalMod,
      Traits: traits,
      RequiredCondition: requiredCondition,
      RequiredSkill: requiredSkill,
    };

    return { success: true, data: weapon };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

/**
 * Parses an ability data line
 */
function parseAbility(line: string, lineNumber: number): ParseResult<AbilityData> {
  try {
    const fields = splitByComma(line);

    if (fields.length < 7) {
      throw new ParseError('Insufficient ability parameters', lineNumber, line);
    }

    const name = fields[0];
    const effectString = fields[1];
    const maxRange = parseIntField(fields[2]);
    const stock = isNoValue(fields[3]) ? 0 : parseIntField(fields[3]);
    const enCost = isNoValue(fields[4]) ? 0 : parseIntField(fields[4]);
    const requiredMorale = isNoValue(fields[5]) ? 0 : parseIntField(fields[5]);
    const traits = fields[6];

    // TODO: Parse effect string into Effects array
    // TODO: Parse optional <conditions> and (requirements) from fields[7+]
    let requiredCondition = '';
    let requiredSkill = '';

    const ability: AbilityData = {
      Name: name,
      Stock: stock,
      ENConsumption: enCost,
      RequiredMorale: requiredMorale,
      MinRange: 0,
      MaxRange: maxRange,
      Traits: traits,
      RequiredSkill: requiredSkill,
      RequiredCondition: requiredCondition,
      Effects: [], // TODO: Parse effect string
    };

    return { success: true, data: ability };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
