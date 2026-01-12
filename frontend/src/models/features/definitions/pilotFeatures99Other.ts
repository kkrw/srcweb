import { type FeatureSpec, FeatureTarget } from "./../types";

// ### その他の特殊能力
export const FEATURES_P_99_OTHER = {
  MoneyGain: {
    name: "資金獲得",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "敵を倒した時に得られる資金が 50% 増加する。;（レベル指定時は 10×資金獲得レベル% 増加）",
  },
  Art: {
    name: "術",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "術を使うために必要な能力。",
  },
  Technique: {
    name: "技",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "技を使うために必要な能力。",
  },
  HasMagic: {
    name: "魔力所有",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "魔力を持つことを示す。",
  },
  Hero: {
    name: "英雄",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "ＨＰが０になった時に 100×英雄レベル/16 %の確率で復活する。",
  },
  Regeneration: {
    name: "再生",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "ＨＰが０になった時に 100×再生レベル/16 %の確率で復活する。",
  },
  DoubleAction: {
    name: "２回行動",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "１ターンに２回、行動が可能になる。",
  },
  Tactics: {
    name: "戦術",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "思考パターン決定の際に用いられる技量初期値がレベル×10増加。",
  },
  Message: {
    name: "メッセージ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "特定の状況でメッセージを表示する。",
  },
  RepairSkill: {
    name: "修理",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "修理装置や回復アビリティを使った際のＨＰ回復量が 10×修理レベル% 増加する。",
  },
  ResupplySkill: {
    name: "補給",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "補給アビリティを使った際のＥＮ回復量が 10×補給レベル% 増加する。",
  },
  Team: {
    name: "チーム",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "特定のチームに所属していることを示す。",
  },
} as const satisfies Record<string, FeatureSpec>;
