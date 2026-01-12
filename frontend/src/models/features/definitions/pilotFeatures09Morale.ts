import { type FeatureSpec, FeatureTarget } from "./../types";

// ### パイロット成長に関する特殊能力
export const FEATURES_P_09_MORALE = {
  // ### 気力に関する特殊能力
  FightingSpirit: {
    name: "闘争本能",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "出撃時の気力が 5×闘争本能レベル 増加する。",
    mainPilotOnly: true,
  },
  MoraleGainOnDamage: {
    name: "損傷時気力増加",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "ダメージを受けた際に気力+ 損傷時気力増加レベル+1。",
    mainPilotOnly: true,
  },
  MoraleGainOnHit: {
    name: "命中時気力増加",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "攻撃を命中させた際に気力+ 命中時気力増加レベル。;（マップ攻撃は例外）",
    mainPilotOnly: true,
  },
  MoraleGainOnMiss: {
    name: "失敗時気力増加",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "攻撃を外してしまった際に気力+ 失敗時気力増加レベル。;（マップ攻撃は例外）",
    mainPilotOnly: true,
  },
  MoraleGainOnEvasion: {
    name: "回避時気力増加",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "攻撃を回避した際に気力+ 回避時気力増加レベル。",
    mainPilotOnly: true,
  },
  MoraleLimit: {
    name: "気力上限",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "気力の上限が 気力上限レベル になる。",
    mainPilotOnly: true,
  },
  MoraleMin: {
    name: "気力下限",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "気力の下限が 気力下限レベル になる。",
    mainPilotOnly: true,
  },
} as const satisfies Record<string, FeatureSpec>;
