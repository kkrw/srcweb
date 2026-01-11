import { DEFAULTS, FORMAT, UNIT_SIZES } from "./constants";
import { ERROR_MESSAGES } from "./messages";

/**
 * Validates pilot name
 * - No half-width spaces
 * - No full-width parentheses
 * - No double quotes
 */
export function validatePilotName(name: string): string | null {
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
 * Validates sex value
 */
export function validateSex(sex: string): { value: string; warning?: string } {
  const validSex = ["男性", "女性", "-"];
  if (!validSex.includes(sex)) {
    return {
      value: "-",
      warning: `性別の設定が間違っています。"-"に設定されました。`,
    };
  }
  return { value: sex };
}

/**
 * Validates personality value
 */
export function validatePersonality(personality: string): {
  value: string;
  warning?: string;
} {
  const validPersonalities = ["機械", "弱気", "普通", "強気", "超強気"];
  if (!validPersonalities.includes(personality)) {
    return {
      value: "普通",
      warning: `性格の設定が間違っています。"普通"に設定されました。`,
    };
  }
  return { value: personality };
}

/**
 * Validates unit name
 * - No half-width spaces
 * - No full-width parentheses
 * - No double quotes
 */
export function validateUnitName(name: string): string | null {
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
export function validateSize(size: string): {
  value: string;
  warning?: string;
} {
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
 * Validates and clamps a number to a range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): { value: number; warning?: string } {
  if (value < min || value > max) {
    return {
      value: Math.max(min, Math.min(max, value)),
      warning: `${fieldName}の値が範囲外です（${min}-${max}）。${Math.max(
        min,
        Math.min(max, value)
      )}に設定されました。`,
    };
  }
  return { value };
}

/**
 * Validates adaptation string (4 characters)
 */
export function validateAdaptation(adaptation: string): {
  value: string;
  warning?: string;
} {
  if (adaptation.length !== FORMAT.ADAPTATION_LENGTH) {
    return {
      value: DEFAULTS.ADAPTATION,
      warning: `地形適応の設定が間違っています（${FORMAT.ADAPTATION_LENGTH}文字必要）。${DEFAULTS.ADAPTATION}に設定されました。`,
    };
  }
  return { value: adaptation };
}

/**
 * Validates bitmap filename
 */
export function validateBitmap(bitmap: string): {
  value: string;
  warning?: string;
} {
  if (!bitmap.toLowerCase().endsWith(FORMAT.BITMAP_EXTENSION)) {
    return {
      value: DEFAULTS.BITMAP,
      warning: `ビットマップの設定が間違っています（${FORMAT.BITMAP_EXTENSION}ファイルが必要）。${DEFAULTS.BITMAP}に設定されました。`,
    };
  }
  return { value: bitmap };
}

/**
 * Validates that traits don't contain invalid Lv specifications
 */
export function validateTraits(
  traits: string,
  itemName: string
): string | null {
  if (traits.includes("Lv")) {
    return `${itemName}の属性のレベル指定が間違っています。`;
  }
  return null;
}
