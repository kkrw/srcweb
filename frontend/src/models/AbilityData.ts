/**
 * アビリティの効果（AbilityEffect）のデータモデル
 *
 * アビリティが持つ具体的な効果内容を定義します。
 * 例: 回復、変身、召喚など
 */
import { type Float, type Integer } from "./BrandedTypes";
import { AndCondition, type Condition } from "./Condition";
import { type SkillRequirement } from "./SkillRequirement";
import { type Trait } from "./Trait";

export interface AbilityEffect {
  /**
   * 効果の種類
   * 例: "回復", "変身", "召喚"
   */
  effectType: string;

  /**
   * 効果量やレベル
   */
  effectLevel: Float;

  /**
   * 補足パラメータ文字列
   */
  effectData: string;
}

/**
 * アビリティ（特殊能力コマンド）のデータモデル
 *
 * ユニットが持つアビリティの定義情報（スペック）を管理します。
 * 修理装置、補給装置、変形などの能動的な能力を定義します。
 */
export interface AbilityData {
  /**
   * アビリティを識別する名称（主キー候補）
   */
  name: string;

  /**
   * 使用可能回数（残弾数に相当）
   */
  stock: Integer;

  /**
   * 使用時に消費するEN量
   */
  enCost: Integer;

  /**
   * 使用に必要な気力
   */
  requiredMorale: Integer;

  /**
   * 効果が及ぶ最小範囲
   */
  minRange: Integer;

  /**
   * 効果が及ぶ最大範囲（射程）
   * 0の場合は自分自身、または射程なし（変身など）を意味します
   */
  maxRange: Integer;

  /**
   * アビリティの分類や属性
   * 例: "P": 移動後使用可, "M": マップ兵器
   * 複数の属性を配列で保持します（順序保持）
   */
  traits: Trait[];

  /**
   * 使用に必要なパイロット技能
   * 例: "ニュータイプ Lv1"
   * "アイテム" が含まれる場合、消費アイテムとして判定されます
   */
  requiredSkill: SkillRequirement[];

  /**
   * 使用に必要なその他の条件
   */
  requiredCondition: Condition;

  /**
   * アビリティが持つ具体的な効果内容のリスト
   */
  effects: AbilityEffect[];
}

/**
 * AbilityEffect のファクトリ関数
 */
export function createAbilityEffect(
  params: Partial<AbilityEffect> = {}
): AbilityEffect {
  return {
    effectType: params.effectType || "",
    effectLevel: params.effectLevel || (0 as Float),
    effectData: params.effectData || "",
  };
}

/**
 * AbilityData のファクトリ関数
 */
export function createAbilityData(
  params: Partial<AbilityData> = {}
): AbilityData {
  return {
    name: params.name || "",
    stock: params.stock || (0 as Integer),
    enCost: params.enCost || (0 as Integer),
    requiredMorale: params.requiredMorale || (0 as Integer),
    minRange: params.minRange || (0 as Integer),
    maxRange: params.maxRange || (0 as Integer),
    traits: params.traits || [],
    requiredSkill: params.requiredSkill || [],
    requiredCondition: params.requiredCondition || new AndCondition([]),
    effects: params.effects || [],
  };
}

/**
 * 消費アイテムかどうかを判定します
 */
export function isItemAbility(ability: AbilityData): boolean {
  return ability.requiredSkill.some((skill) => skill.skillName === "アイテム");
}
