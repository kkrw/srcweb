import { FEATURES } from "./definitions";
import type { FeatureSpec } from "./types";

// 日本語名から FeatureSpec を検索するための Map を一度だけ生成
const nameToFeatureMap = new Map<string, FeatureSpec>(
  Object.values(FEATURES).map((s) => [s.name, s])
);

/**
 * 日本語名から FeatureSpec を検索します
 * @param name - 特殊能力の日本語名（例: "バリア", "シールド"）
 * @returns FeatureSpec または undefined
 */
export const findFeatureByName = (name: string): FeatureSpec | undefined =>
  nameToFeatureMap.get(name);

/**
 * 全ての FeatureSpec を取得します
 */
export const allFeatures = (): FeatureSpec[] => Object.values(FEATURES);
