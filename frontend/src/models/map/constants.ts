import type { Integer } from "../BrandedTypes";

/** Valid terrain types */
export const TERRAIN_TYPES = [
  "陸",
  "空",
  "水",
  "深水",
  "屋内",
  "宇宙",
  "月面",
] as const;

export type TERRAIN_TYPE = (typeof TERRAIN_TYPES)[number];

export const TERRAIN_UNKNOWN = {
  id: 0,
  name: "不明",
  type: "陸" as TERRAIN_TYPE,
  cost: 0 as Integer,
};
