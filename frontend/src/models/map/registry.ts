import { TERRAIN_FEATURES } from "./features";
import type { TerrainFeatureSpec } from "./types";

// 日本語名から TerrainFeatureSpec を検索するための Map を一度だけ生成
const nameToFeatureMap = new Map<string, TerrainFeatureSpec>(
  Object.values(TERRAIN_FEATURES).map((s) => [s.name, s])
);

/**
 * 日本語名から TerrainFeatureSpec を検索します
 * @param name - 特殊能力の日本語名（例: "ＨＰ回復", "状態付加"）
 * @returns TerrainFeatureSpec または undefined
 */
export const findTerrainFeatureByName = (
  name: string
): TerrainFeatureSpec | undefined => nameToFeatureMap.get(name);

/**
 * 全ての TerrainFeatureSpec を取得します
 */
export const allTerrainFeatures = (): TerrainFeatureSpec[] =>
  Object.values(TERRAIN_FEATURES);
