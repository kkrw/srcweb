import { type FeatureSpec, FeatureTarget } from "../types";

// ### 武器関連特殊能力
export const FEATURES_U_08_WEAPON = {
  CombinationAttack: {
    name: "合体技",
    target: FeatureTarget.Unit,
    effects: [],
    description: "パートナーと合体技を使用可能。",
    visible: false,
  },
  TransformAttack: {
    name: "変形技",
    target: FeatureTarget.Unit,
    effects: [],
    description: "変形技使用後の変形先を指定。",
    visible: false,
  },
  FollowUpAttack: {
    name: "追加攻撃",
    target: FeatureTarget.Unit,
    effects: [],
    description: "対象武器による攻撃後に一定確率で追撃用武器で追撃。",
  },
  EnhanceWeapon: {
    name: "武器強化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定武器の攻撃力を 100×武器強化レベル 増加。",
    visible: false,
  },
  ExtendRange: {
    name: "射程延長",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定武器の射程を 射程延長レベル 増加。",
    visible: false,
  },
  EnhanceHitRate: {
    name: "命中率強化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定武器の命中率を 5×命中率強化レベル 増加。",
    visible: false,
  },
  EnhanceCritRate: {
    name: "ＣＴ率強化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定武器のクリティカル率を 5×ＣＴ率強化レベル 増加。",
    visible: false,
  },
  EnhanceSpecialEffectRate: {
    name: "特殊効果発動率強化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定武器の特殊効果発動率を 5×特殊効果発動率強化レベル 増加。",
    visible: false,
  },
  AddAttackAttribute: {
    name: "攻撃属性",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定武器に攻撃属性を付加。",
    visible: false,
  },
} as const satisfies Record<string, FeatureSpec>;
