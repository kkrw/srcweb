/**
 * 武器（Weapon）のデータモデル
 *
 * ユニットが所持する武器の定義情報（スペック）を管理します。
 * 武器の名称、攻撃力、射程、属性などを保持します。
 */
export interface WeaponData {
  /**
   * 武器を識別する名称（主キー候補）
   */
  Name: string;

  /**
   * 武器の基本攻撃力
   */
  AttackPower: number;

  /**
   * 攻撃可能な最小範囲
   */
  MinRange: number;

  /**
   * 攻撃可能な最大範囲
   */
  MaxRange: number;

  /**
   * 命中率への補正値（%）
   */
  AccuracyMod: number;

  /**
   * 最大弾数
   * 0の場合は弾数制限なし（またはEN消費型）として扱われます
   */
  Ammo: number;

  /**
   * 攻撃1回あたりのエネルギー消費量
   */
  ENCost: number;

  /**
   * 攻撃を使用するために必要なパイロットの気力値
   */
  RequiredMorale: number;

  /**
   * 地形適応（4文字の文字列）
   * 形式: "AAAA" (左から空・陸・水・宇)
   * ランク: S, A, B, C, - など
   */
  Adaptation: string;

  /**
   * クリティカル発生率への補正値（%）
   */
  CriticalMod: number;

  /**
   * 武器の特性を表す文字列コード
   * 例: "P": 移動後攻撃可, "B": ビーム兵器, "S": 特殊効果
   * 複数の属性が含まれることがあります
   */
  Traits: string;

  /**
   * 武器使用に必要なパイロット技能
   * 例: "ニュータイプ Lv1"
   * "アイテム" が含まれる場合、アイテム武器として判定されます
   */
  RequiredSkill: string;

  /**
   * 武器使用に必要なその他の条件
   */
  RequiredCondition: string;
}

/**
 * WeaponData のファクトリ関数
 */
export function createWeaponData(params: Partial<WeaponData> = {}): WeaponData {
  return {
    Name: params.Name || "",
    AttackPower: params.AttackPower || 0,
    MinRange: params.MinRange || 1,
    MaxRange: params.MaxRange || 1,
    AccuracyMod: params.AccuracyMod || 0,
    Ammo: params.Ammo || 0,
    ENCost: params.ENCost || 0,
    RequiredMorale: params.RequiredMorale || 0,
    Adaptation: params.Adaptation || "AAAA",
    CriticalMod: params.CriticalMod || 0,
    Traits: params.Traits || "",
    RequiredSkill: params.RequiredSkill || "",
    RequiredCondition: params.RequiredCondition || "",
  };
}

/**
 * アイテム武器かどうかを判定します
 */
export function isItemWeapon(weapon: WeaponData): boolean {
  return weapon.RequiredSkill.includes("アイテム");
}
