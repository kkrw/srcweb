/**
 * Data models index
 *
 * All game data models are exported from this file for convenient importing.
 */

// Branded Types
export type { Integer, Float } from "./BrandedTypes";
export {
  isInteger,
  toInteger,
  toFloat,
  hasDecimalPart,
} from "./BrandedTypes";

// Feature Data
export type { FeatureData } from "./FeatureData";
export { DEFAULT_LEVEL, createFeatureData } from "./FeatureData";

// Weapon Data
export type { WeaponData } from "./WeaponData";
export { createWeaponData, isItemWeapon } from "./WeaponData";

// Ability Data
export type { AbilityData, AbilityEffect } from "./AbilityData";
export {
  createAbilityData,
  createAbilityEffect,
  isItemAbility,
} from "./AbilityData";

// Unit Data
export type { UnitData } from "./UnitData";
export { createUnitData, getBitmap as getUnitBitmap } from "./UnitData";

// Skill Data
export type { SkillData } from "./SkillData";
export { createSkillData } from "./SkillData";

// Special Power
export type { SpecialPower } from "./SpecialPower";
export { createSpecialPower } from "./SpecialPower";

// Pilot Data
export type { PilotData } from "./PilotData";
export { createPilotData, getBitmap as getPilotBitmap } from "./PilotData";

// Map Data
export type { MapData, MapCell } from "./MapData";
export { createMapData, createMapCell, getCell, setCell } from "./MapData";

// Hot Point
export type { HotPoint } from "./HotPoint";
export { createHotPoint } from "./HotPoint";

// Event State
export type { EventState } from "./EventState";
export { createEventState } from "./EventState";

// User Settings
export type { UserSettings } from "./UserSettings";
export { createUserSettings } from "./UserSettings";

// Game State
export type { GameState } from "./GameState";
export { createGameState } from "./GameState";
