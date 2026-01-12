import type { Float, Integer } from "../../BrandedTypes";
import { type FeatureSpec, FeatureTarget } from "../types";

// ### 防御特性に関する特殊能力
export const FEATURES_U_01_DEFENCE = {
  Absorb: {
    name: "吸収",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した属性を持つ攻撃のダメージを吸収する。",
  },
  Nullify: {
    name: "無効化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した属性を持つ攻撃を無効化する。",
  },
  FixedResistance: {
    name: "耐性",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した属性を持つ攻撃のダメージを半減する。",
  },
  Vulnerability: {
    name: "弱点",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した属性を持つ攻撃に対して装甲が半減する。",
  },
  Effective: {
    name: "有効",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した属性を持つ攻撃に対して吸収、無効化、耐性の効果が発生しなくなる。",
  },
  NullifySpecialEffect: {
    name: "特殊効果無効化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した特殊効果を無効化する。",
  },
  // ### 防御系特殊能力
  Shield: {
    name: "シールド",
    target: FeatureTarget.Unit,
    effects: [{ type: "ReduceDamage", damageReductionRate: 0.5 as Float }],
    description: "Ｓ防御Lv/16の確率で防御を行い、ダメージを半減。",
  },
  EnergyShield: {
    name: "エネルギーシールド",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "ReduceDamage",
        damageReductionRate: 0.5 as Float,
        damageReduction: 100 as Integer,
        enCost: 10 as Integer,
      },
    ],
    description:
      "Ｓ防御Lv/16の確率で防御を行い、ダメージを半減した上で更に 100×レベル 減少。;発動時に5ＥＮ消費。「無」属性を持つ武器には無効。",
  },
  SmallShield: {
    name: "小型シールド",
    target: FeatureTarget.Unit,
    effects: [{ type: "ReduceDamage", damageReductionRate: (1 / 3) as Float }],
    description: "Ｓ防御Lv/16の確率で防御を行い、ダメージを2/3に減少。",
  },
  LargeShield: {
    name: "大型シールド",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "ReduceDamage",
        damageReductionRate: 0.5 as Float,
        successRateBonus: (1 / 16) as Float,
      },
    ],
    description: "(Ｓ防御Lv+1)/16の確率で防御を行い、ダメージを半減。",
  },
  ActiveShield: {
    name: "アクティブシールド",
    target: FeatureTarget.Unit,
    effects: [],
    description: "(Ｓ防御Lv+2)/16の確率で防御を行い、ダメージを半減。",
  },
  PhysicalShield: {
    name: "盾",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "盾レベル 回、攻撃によって貫通されるまでシールド防御を行い、ダメージを減少させる。;ダメージの減少量はパイロットのＳ防御レベルによって決まる。",
  },
  Barrier: {
    name: "バリア",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "BlockDamage",
        damageCapacity: 1000 as Integer,
        enCost: 10 as Integer,
      },
    ],
    description: "ダメージ 1000×バリアレベル 以下の攻撃を無効化。;発動時に10ＥＮ消費。",
  },
  BarrierShield: {
    name: "バリアシールド",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "Ｓ防御Lv/16の確率で発動し、ダメージ 1000×バリアシールドレベル 以下の攻撃を無効化。;発動時に10ＥＮ消費。",
  },
  AreaBarrier: {
    name: "広域バリア",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "効果範囲内の味方ユニットに対するダメージ 1000×広域バリアレベル 以下の攻撃を無効化。;ただし攻撃側も有効範囲内にいる場合は無効化。",
  },
  Field: {
    name: "フィールド",
    target: FeatureTarget.Unit,
    effects: [],
    description: "攻撃のダメージを 500×フィールドレベル 減少させる。",
  },
  ActiveField: {
    name: "アクティブフィールド",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "Ｓ防御Lv/16の確率で発動し、攻撃のダメージを 500×アクティブフィールドレベル 減少させる。",
  },
  AreaField: {
    name: "広域フィールド",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "効果範囲内の味方ユニットに対する攻撃のダメージを 500×広域フィールドレベル 減少させる。;ただし攻撃側も有効範囲内にいる場合は無効化。",
  },
  Protection: {
    name: "プロテクション",
    target: FeatureTarget.Unit,
    effects: [],
    description: "攻撃のダメージを 10×プロテクションレベル% 減少させる。;発動時に10ＥＮ消費。",
  },
  ActiveProtection: {
    name: "アクティブプロテクション",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "Ｓ防御Lv/16の確率で発動し、攻撃のダメージを 10×アクティブプロテクションレベル% 減少させる。",
  },
  AreaProtection: {
    name: "広域プロテクション",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "効果範囲内の味方ユニットに対する攻撃のダメージを 10×広域プロテクションレベル% 減少させる。;ただし攻撃側も有効範囲内にいる場合は無効化。",
  },
  Resist: {
    name: "レジスト",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した属性の攻撃に対するダメージを 10×レジストレベル% 減少させる。",
  },
  Armor: {
    name: "アーマー",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した属性の攻撃に対する装甲値を 100×アーマーレベル 増加させる。",
  },
  Reflect: {
    name: "反射",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した属性の攻撃を一定確率で跳ね返す。;反射した攻撃が敵に当たる確率は通常の半分。",
  },
  ParryAndCounter: {
    name: "当て身技",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した属性の攻撃を一定確率で切り返して無効化し、指定武器で反撃する。",
  },
  Block: {
    name: "阻止",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した属性の攻撃を一定確率で阻止する。",
  },
  AreaBlock: {
    name: "広域阻止",
    target: FeatureTarget.Unit,
    effects: [],
    description: "効果範囲内の味方ユニットに対する指定した属性の攻撃を一定確率で阻止する。;ただし攻撃側も有効範囲内にいる場合は無効。",
  },
  Fusion: {
    name: "融合",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "融合レベル/16 の確率で発動し、攻撃のダメージをＨＰに変換する。;ただし「武」「突」「接」属性を持つ武器には無効。",
  },
  BeamAbsorption: {
    name: "ビーム吸収",
    target: FeatureTarget.Unit,
    effects: [],
    description: "ビーム(Ｂ属性)による攻撃を受けた際にダメージをＨＰに変換する。",
  },
  Conversion: {
    name: "変換",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した属性の攻撃を受けた際にダメージをＥＮに変換する。;ＥＮ増加量＝0.01×変換レベル×ダメージ。",
  },
  AutoCounterAttack: {
    name: "自動反撃",
    target: FeatureTarget.Unit,
    effects: [],
    description: "敵からの指定した属性の攻撃が命中した際に一定確率で指定武器を使った自動反撃を行う。",
  },
} as const satisfies Record<string, FeatureSpec>;
