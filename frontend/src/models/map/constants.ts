import type { Integer } from "../BrandedTypes";

export type TERRAIN_TYPE =
  | "陸"
  | "空"
  | "水"
  | "深水"
  | "屋内"
  | "宇宙"
  | "月面";

export const TERRAIN_UNKNOWN = {
  id: 0,
  name: "不明",
  type: "陸" as TERRAIN_TYPE,
  cost: 0 as Integer,
};
