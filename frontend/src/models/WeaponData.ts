/**
 * 武器（Weapon）のデータモデル
 *
 * ユニットが所持する武器の定義情報（スペック）を管理します。
 * 武器の名称、攻撃力、射程、属性などを保持します。
 */
import { DEFAULTS } from "../parsers/constants";
import { Adaptation } from "./Adaptation";
import { type Integer } from "./BrandedTypes";
import { AndCondition, type Condition, parseCondition } from "./Condition";
import {
  type SkillRequirement,
  parseSkillRequirement,
} from "./SkillRequirement";
import { type Trait, parseTraits } from "./Trait";

export interface WeaponData {
  /**
   * 武器を識別する名称（主キー候補）
   */
  name: string;

  /**
   * 武器の基本攻撃力
   */
  attackPower: Integer;

  /**
   * 攻撃可能な最小範囲
   */
  minRange: Integer;

  /**
   * 攻撃可能な最大範囲
   */
  maxRange: Integer;

  /**
   * 命中率への補正値（%）
   */
  accuracyMod: Integer;

  /**
   * 最大弾数
   * 0の場合は弾数制限なし（またはEN消費型）として扱われます
   */
  ammo: Integer;

  /**
   * 攻撃1回あたりのエネルギー消費量
   */
  enCost: Integer;

  /**
   * 攻撃を使用するために必要なパイロットの気力値
   */
  requiredMorale: Integer;

  /**
   * 地形適応
   * 形式: "AAAA" -> 空・陸・水・宇
   */
  adaptation: Adaptation;

  /**
   * クリティカル発生率への補正値（%）
   */
  criticalMod: Integer;

  /**
   * 武器の特性
   * 例: "Ｐ": 移動後攻撃可, "Ｂ": ビーム兵器
   * 複数の属性を配列で保持します（順序保持）
   */
  traits: Trait[];

  /**
   * 武器使用に必要なパイロット技能
   * 例: "ニュータイプ Lv1"
   * "アイテム" が含まれる場合、アイテム武器として判定されます
   */
  requiredSkill: SkillRequirement[];

  /**
   * 武器使用に必要なその他の条件
   */
  requiredCondition: Condition;
}

/**
 * WeaponData のファクトリ関数
 */
export function createWeaponData(params: Partial<WeaponData> = {}): WeaponData {
  return {
    name: params.name || "",
    attackPower: params.attackPower || (0 as Integer),
    minRange: params.minRange || (1 as Integer),
    maxRange: params.maxRange || (1 as Integer),
    accuracyMod: params.accuracyMod || (0 as Integer),
    ammo: params.ammo || (0 as Integer),
    enCost: params.enCost || (0 as Integer),
    requiredMorale: params.requiredMorale || (0 as Integer),
    adaptation: params.adaptation || Adaptation.fromString(DEFAULTS.ADAPTATION),
    criticalMod: params.criticalMod || (0 as Integer),
    traits: params.traits || [],
    requiredSkill: params.requiredSkill || [],
    requiredCondition: params.requiredCondition || new AndCondition([]),
  };
}

/**
 * 文字列データから WeaponData を生成するためのヘルパー関数
 * (マイグレーション過渡期用)
 */
export function parseWeaponData(
  rawData: Partial<WeaponData> & {
    adaptation?: string | Adaptation;
    traits?: string | Trait[];
    requiredSkill?: string | SkillRequirement[];
    requiredCondition?: string | Condition;
  }
): WeaponData {
  return createWeaponData({
    ...rawData,
    adaptation:
      typeof rawData.adaptation === "string"
        ? Adaptation.fromString(rawData.adaptation)
        : rawData.adaptation,
    traits:
      typeof rawData.traits === "string"
        ? parseTraits(rawData.traits)
        : rawData.traits,
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
 * アイテム武器かどうかを判定します
 */
export function isItemWeapon(weapon: WeaponData): boolean {
  return weapon.requiredSkill.some((skill) => skill.skillName === "アイテム");
}
