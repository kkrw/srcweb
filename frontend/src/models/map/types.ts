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
  id: Integer;
  name: string;
  graphicFileNamePrefix: string;
  type: TERRAIN_TYPE;
  cost: Float;
  defenseBonusRate?: Float;
  evasionBonusRate?: Float;
  features: TerrainFeature[];
  hideInEditor?: boolean;
};

export type TerrainFeature = {
  spec: TerrainFeatureSpec;
  level: Float;
  parameters: string[];
};

export type TerrainFeatureSpec = {
  name: string;
  effects: TerrainEffect[];
};

export interface TerrainEffect {
  name: string;
}
