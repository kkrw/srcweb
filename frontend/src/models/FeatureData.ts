/**
 * 特殊能力（Feature）のデータモデル
 *
 * ユニット、アイテム、地形などが保持する特殊能力の定義情報を管理します。
 * 例：「変形 Lv1」、「バリア Lv2」、「合体」など
 */
import { type Float } from "./BrandedTypes";
import {
  AndCondition,
  type Condition,
  parseCondition,
} from "./interpreter/Condition";
import {
  type SkillRequirement,
  parseSkillRequirement,
} from "./interpreter/SkillRequirement";

export interface FeatureData {
  /**
   * 特殊能力の種類を識別する名前
   * 例: "変形", "バリア", "シールド"
   */
  Name: string;

  /**
   * 能力の強度や段階を示す数値
   * DEFAULT_LEVEL (-1000) が初期値の場合、レベル1相当として扱われます
   */
  Level: Float;

  /**
   * 能力に付随するパラメータ文字列
   * 例: 変形先のユニット名リスト、バリアの軽減値や属性指定など
   */
  Parameters: string;

  /**
   * この能力を発動・使用するためにパイロットに要求される技能名
   * 例: "ニュータイプ"
   * 定義文字列の `(...)` 部分から抽出されます
   */
  RequiredSkill: SkillRequirement[];

  /**
   * この能力を発動するために必要な条件
   * 定義文字列の `<...>` 部分から抽出されます
   */
  RequiredCondition: Condition;
}

/**
 * FeatureData の初期値定数
 */
export const DEFAULT_LEVEL = -1000 as Float;

/**
 * FeatureData のファクトリ関数
 */
export function createFeatureData(
  params: Partial<FeatureData> = {}
): FeatureData {
  return {
    Name: params.Name || "",
    Level: params.Level ?? DEFAULT_LEVEL,
    Parameters: params.Parameters || "",
    RequiredSkill: params.RequiredSkill || [],
    RequiredCondition: params.RequiredCondition || new AndCondition([]),
  };
}

/**
 * 文字列データから FeatureData を生成するためのヘルパー関数
 */
export function parseFeatureData(
  rawData: Partial<FeatureData> & {
    RequiredSkill?: string | SkillRequirement[];
    RequiredCondition?: string | Condition;
  }
): FeatureData {
  return createFeatureData({
    ...rawData,
    RequiredSkill:
      typeof rawData.RequiredSkill === "string"
        ? parseSkillRequirement(rawData.RequiredSkill)
        : rawData.RequiredSkill,
    RequiredCondition:
      typeof rawData.RequiredCondition === "string"
        ? parseCondition(rawData.RequiredCondition)
        : rawData.RequiredCondition,
  });
}
