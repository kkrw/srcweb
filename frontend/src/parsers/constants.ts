/**
 * Parser constants and validation limits
 * Based on VB5 SRC implementation
 */

/**
 * Unit data validation limits
 */
export const UNIT_LIMITS = {
  PILOT_CAPACITY: { MIN: 1, MAX: 99 },
  ITEM_SLOTS: { MIN: 0, MAX: 99 },
  SPEED: { MIN: 0, MAX: 99 },
  COST: { MIN: 0, MAX: 9999999 },
  EXP_VALUE: { MIN: 0, MAX: 9999 },
  HP: { MIN: 0, MAX: 9999999 },
  EN: { MIN: 0, MAX: 9999 },
  ARMOR: { MIN: 0, MAX: 99999 },
  MOBILITY: { MIN: 0, MAX: 9999 },
} as const;

/**
 * Weapon data validation limits
 */
export const WEAPON_LIMITS = {
  ATTACK_POWER: { MIN: 0, MAX: 99999 },
  MIN_RANGE: { MIN: 1, MAX: 99 },
  MAX_RANGE: { MIN: 1, MAX: 99 },
  ACCURACY_MOD: { MIN: -999, MAX: 999 },
  AMMO: { MIN: 0, MAX: 99 },
  EN_COST: { MIN: 0, MAX: 999 },
  REQUIRED_MORALE: { MIN: 0, MAX: 1000 },
  CRITICAL_MOD: { MIN: -999, MAX: 999 },
} as const;

/**
 * Ability data validation limits
 */
export const ABILITY_LIMITS = {
  MAX_RANGE: { MIN: 0, MAX: 99 },
  STOCK: { MIN: 0, MAX: 99 },
  EN_COST: { MIN: 0, MAX: 999 },
  REQUIRED_MORALE: { MIN: 0, MAX: 1000 },
} as const;

/**
 * Valid unit sizes
 */
export const UNIT_SIZES = ["XL", "LL", "L", "M", "S", "SS"] as const;

/**
 * Default values
 */
export const DEFAULTS = {
  SIZE: "M",
  ADAPTATION: "AAAA",
  ADAPTATION_SINGLE: "A",
  BITMAP: "-.bmp",
  UNIT_CLASS: "汎用",
} as const;

/**
 * Format constants
 */
export const FORMAT = {
  ADAPTATION_LENGTH: 4,
  BITMAP_EXTENSION: ".bmp",
} as const;
