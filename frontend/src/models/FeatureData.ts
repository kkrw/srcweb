/**
 * 特殊能力（Feature）のデータモデル
 *
 * ユニット、アイテム、地形などが保持する特殊能力の定義情報を管理します。
 * 例：「変形 Lv1」、「バリア Lv2」、「合体」など
 */
import { type Float, type Integer } from "./BrandedTypes";
import { AndCondition, type Condition, parseCondition } from "./Condition";
import { FEATURES } from "./features/definitions";
import type { Feature } from "./features/types";
import {
  type SkillRequirement,
  parseSkillRequirement,
} from "./SkillRequirement";

/**
 * FeatureData の初期値定数
 */
export const DEFAULT_LEVEL = -1000 as Float;

/**
 * FeatureData のファクトリ関数
 */
export function createFeatureData(params: Partial<Feature> = {}): Feature {
  return {
    spec: params.spec || FEATURES.None,
    name: params.name || "",
    displayName: params.displayName,
    description: params.description,
    showLevel: params.showLevel ?? true,
    visible: params.visible ?? true,
    level: params.level,
    requiredSkill: params.requiredSkill || [],
    requiredCondition: params.requiredCondition || new AndCondition([]),
    rawParameters: params.rawParameters,
  };
}

/**
 * 文字列データから FeatureData を生成するためのヘルパー関数
 */
export function parseFeatureData(
  rawData: Partial<Feature> & {
    requiredSkill?: string | SkillRequirement[];
    requiredCondition?: string | Condition;
  }
): Feature {
  return createFeatureData({
    ...rawData,
    requiredSkill:
      typeof rawData.requiredSkill === "string"
        ? parseSkillRequirement(rawData.requiredSkill)
        : rawData.requiredSkill,
    requiredCondition:
      typeof rawData.requiredCondition === "string"
        ? parseCondition(rawData.requiredCondition)
        : rawData.requiredCondition,
  });
}

/**
 * パイロットの特殊能力習得情報
 */
export interface FeatureAcquisitionData {
  /**
   * 習得する特殊能力
   */
  feature: Feature;

  /**
   * 特殊能力習得に必要なパイロットレベル
   */
  requiredLevel: Integer;
}
