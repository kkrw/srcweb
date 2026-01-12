/**
 * Data models index
 *
 * All game data models are exported from this file for convenient importing.
 */

// Branded Types
export { hasDecimalPart, isInteger, toFloat, toInteger } from "./BrandedTypes";
export type { Float, Integer } from "./BrandedTypes";

// Feature Data
export { createFeatureData, DEFAULT_LEVEL } from "./FeatureData";
export type { Feature as FeatureData } from "./FeatureData";

// Weapon Data
export { createWeaponData, isItemWeapon } from "./WeaponData";
export type { WeaponData } from "./WeaponData";

// Ability Data
export {
  createAbilityData,
  createAbilityEffect,
  isItemAbility,
} from "./AbilityData";
export type { AbilityData, AbilityEffect } from "./AbilityData";

// Unit Data
export { createUnitData, getBitmap as getUnitBitmap } from "./UnitData";
export type { UnitData } from "./UnitData";

// Special Power
export { createSpecialPower } from "./SpecialPower";
export type { SpecialPower } from "./SpecialPower";

// Pilot Data
export { createPilotData, getBitmap as getPilotBitmap } from "./PilotData";
export type { PilotData } from "./PilotData";

// Map Data
export { createMapCell, createMapData, getCell, setCell } from "./MapData";
export type { MapCell, MapData } from "./MapData";

// Hot Point
export { createHotPoint } from "./HotPoint";
export type { HotPoint } from "./HotPoint";

// Event State
export { createEventState } from "./EventState";
export type { EventState } from "./EventState";

// User Settings
export { createUserSettings } from "./UserSettings";
export type { UserSettings } from "./UserSettings";

// Game State
export { createGameState } from "./GameState";
export type { GameState } from "./GameState";
