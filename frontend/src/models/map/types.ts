import type { Float, Integer } from "../BrandedTypes";
import type { TERRAIN_TYPE } from "./constants";

export const POSITION = {
  GROUND: "ground",
  AIR: "air",
  WATER: "water",
  SPACE: "space",
  UNDERGROUND: "underground",
};
export type Position = (typeof POSITION)[keyof typeof POSITION];

export type Terrain = {
  id: number;
  name: string;
  type: TERRAIN_TYPE;
  cost: Integer;
  defenseBonusRate?: Float;
  evasionBonusRate?: Float;
  hpRecoverRate?: Float;
  enRecoverRate?: Float;
};
