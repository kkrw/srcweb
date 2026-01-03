/**
 * アビリティの効果（AbilityEffect）のデータモデル
 *
 * アビリティが持つ具体的な効果内容を定義します。
 * 例: 回復、変身、召喚など
 */
import { type Float, type Integer } from "./BrandedTypes";
import { AndCondition, type Condition } from "./interpreter/Condition";
import { type SkillRequirement } from "./interpreter/SkillRequirement";
import { type Trait } from "./interpreter/Trait";

export interface AbilityEffect {
  /**
   * 効果の種類
   * 例: "回復", "変身", "召喚"
   */
  EffectType: string;

  /**
   * 効果量やレベル
   */
  EffectLevel: Float;

  /**
   * 補足パラメータ文字列
   */
  EffectData: string;
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
  Name: string;

  /**
   * 使用可能回数（残弾数に相当）
   */
  Stock: Integer;

  /**
   * 使用時に消費するEN量
   */
  ENCost: Integer;

  /**
   * 使用に必要な気力
   */
  RequiredMorale: Integer;

  /**
   * 効果が及ぶ最小範囲
   */
  MinRange: Integer;

  /**
   * 効果が及ぶ最大範囲（射程）
   * 0の場合は自分自身、または射程なし（変身など）を意味します
   */
  MaxRange: Integer;

  /**
   * アビリティの分類や属性
   * 例: "P": 移動後使用可, "M": マップ兵器
   * 複数の属性を配列で保持します（順序保持）
   */
  Traits: Trait[];

  /**
   * 使用に必要なパイロット技能
   * 例: "ニュータイプ Lv1"
   * "アイテム" が含まれる場合、消費アイテムとして判定されます
   */
  RequiredSkill: SkillRequirement[];

  /**
   * 使用に必要なその他の条件
   */
  RequiredCondition: Condition;

  /**
   * アビリティが持つ具体的な効果内容のリスト
   */
  Effects: AbilityEffect[];
}

/**
 * AbilityEffect のファクトリ関数
 */
export function createAbilityEffect(
  params: Partial<AbilityEffect> = {}
): AbilityEffect {
  return {
    EffectType: params.EffectType || "",
    EffectLevel: params.EffectLevel || (0 as Float),
    EffectData: params.EffectData || "",
  };
}

/**
 * AbilityData のファクトリ関数
 */
export function createAbilityData(
  params: Partial<AbilityData> = {}
): AbilityData {
  return {
    Name: params.Name || "",
    Stock: params.Stock || (0 as Integer),
    ENCost: params.ENCost || (0 as Integer),
    RequiredMorale: params.RequiredMorale || (0 as Integer),
    MinRange: params.MinRange || (0 as Integer),
    MaxRange: params.MaxRange || (0 as Integer),
    Traits: params.Traits || [],
    RequiredSkill: params.RequiredSkill || [],
    RequiredCondition: params.RequiredCondition || new AndCondition([]),
    Effects: params.Effects || [],
  };
}

/**
 * 消費アイテムかどうかを判定します
 */
export function isItemAbility(ability: AbilityData): boolean {
  return ability.RequiredSkill.some((skill) => skill.skillName === "アイテム");
}
