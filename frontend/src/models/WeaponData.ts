/**
 * 武器（Weapon）のデータモデル
 *
 * ユニットが所持する武器の定義情報（スペック）を管理します。
 * 武器の名称、攻撃力、射程、属性などを保持します。
 */
import { type Integer } from "./BrandedTypes";
import { Adaptation } from "./interpreter/Adaptation";
import {
  AndCondition,
  type Condition,
  parseCondition,
} from "./interpreter/Condition";
import {
  type SkillRequirement,
  parseSkillRequirement,
} from "./interpreter/SkillRequirement";
import { type Trait, parseTraits } from "./interpreter/Trait";

export interface WeaponData {
  /**
   * 武器を識別する名称（主キー候補）
   */
  Name: string;

  /**
   * 武器の基本攻撃力
   */
  AttackPower: Integer;

  /**
   * 攻撃可能な最小範囲
   */
  MinRange: Integer;

  /**
   * 攻撃可能な最大範囲
   */
  MaxRange: Integer;

  /**
   * 命中率への補正値（%）
   */
  AccuracyMod: Integer;

  /**
   * 最大弾数
   * 0の場合は弾数制限なし（またはEN消費型）として扱われます
   */
  Ammo: Integer;

  /**
   * 攻撃1回あたりのエネルギー消費量
   */
  ENCost: Integer;

  /**
   * 攻撃を使用するために必要なパイロットの気力値
   */
  RequiredMorale: Integer;

  /**
   * 地形適応
   * 形式: "AAAA" -> 空・陸・水・宇
   */
  Adaptation: Adaptation;

  /**
   * クリティカル発生率への補正値（%）
   */
  CriticalMod: Integer;

  /**
   * 武器の特性
   * 例: "Ｐ": 移動後攻撃可, "Ｂ": ビーム兵器
   * 複数の属性を配列で保持します（順序保持）
   */
  Traits: Trait[];

  /**
   * 武器使用に必要なパイロット技能
   * 例: "ニュータイプ Lv1"
   * "アイテム" が含まれる場合、アイテム武器として判定されます
   */
  RequiredSkill: SkillRequirement[];

  /**
   * 武器使用に必要なその他の条件
   */
  RequiredCondition: Condition;
}

/**
 * WeaponData のファクトリ関数
 */
export function createWeaponData(params: Partial<WeaponData> = {}): WeaponData {
  return {
    Name: params.Name || "",
    AttackPower: params.AttackPower || (0 as Integer),
    MinRange: params.MinRange || (1 as Integer),
    MaxRange: params.MaxRange || (1 as Integer),
    AccuracyMod: params.AccuracyMod || (0 as Integer),
    Ammo: params.Ammo || (0 as Integer),
    ENCost: params.ENCost || (0 as Integer),
    RequiredMorale: params.RequiredMorale || (0 as Integer),
    Adaptation: params.Adaptation || Adaptation.fromString("AAAA"),
    CriticalMod: params.CriticalMod || (0 as Integer),
    Traits: params.Traits || [],
    RequiredSkill: params.RequiredSkill || [],
    RequiredCondition: params.RequiredCondition || new AndCondition([]),
  };
}

/**
 * 文字列データから WeaponData を生成するためのヘルパー関数
 * (マイグレーション過渡期用)
 */
export function parseWeaponData(
  rawData: Partial<WeaponData> & {
    Adaptation?: string | Adaptation;
    Traits?: string | Trait[];
    RequiredSkill?: string | SkillRequirement[];
    RequiredCondition?: string | Condition;
  }
): WeaponData {
  return createWeaponData({
    ...rawData,
    Adaptation:
      typeof rawData.Adaptation === "string"
        ? Adaptation.fromString(rawData.Adaptation)
        : rawData.Adaptation,
    Traits:
      typeof rawData.Traits === "string"
        ? parseTraits(rawData.Traits)
        : rawData.Traits,
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

/**
 * アイテム武器かどうかを判定します
 */
export function isItemWeapon(weapon: WeaponData): boolean {
  return weapon.RequiredSkill.some((skill) => skill.skillName === "アイテム");
}
