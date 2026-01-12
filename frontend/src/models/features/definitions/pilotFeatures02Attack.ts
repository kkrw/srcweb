import { type FeatureSpec, FeatureTarget } from "./../types";

// ### 攻撃に関する特殊能力
export const FEATURES_P_02_ATTACK = {
  UnleashPotential: {
    name: "潜在力開放",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "気力130以上で発動し、ダメージを 25% 増加させる。",
    mainPilotOnly: true,
  },
  Forte: {
    name: "得意技",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "「属性」属性を持つ武器・アビリティによるダメージ・効果量が 20% 増加。;また、アビリティの継続時間が 40% 増加。",
    mainPilotOnly: true,
  },
  Weakness: {
    name: "不得手",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "「属性」属性を持つ武器・アビリティによるダメージ・効果量が 20% 減少。;また、アビリティの継続時間が 40% 減少。",
    mainPilotOnly: true,
  },
  Hunter: {
    name: "ハンター",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ターゲットが指定した対象である場合、ターゲットに与えるダメージが ハンターレベル×10% 増加する。",
    mainPilotOnly: true,
  },
  Counter: {
    name: "カウンター",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "１ターンに カウンターレベル 回反撃がカウンター攻撃になり、相手の攻撃に先制して反撃を行う。",
    mainPilotOnly: true,
  },
  Premonition: {
    name: "先読み",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "先読みレベル/16 の確率で反撃がカウンター攻撃になり、相手の攻撃に先制して反撃を行う。",
    mainPilotOnly: true,
  },
  PreemptiveStrike: {
    name: "先手必勝",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "パイロットの気力が120以上で発動。;反撃が必ずカウンター攻撃になり、相手の攻撃に先制して反撃を行う。",
    mainPilotOnly: true,
  },
  ReAttack: {
    name: "再攻撃",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "自分の攻撃の直後に 再攻撃レベル/16 の確率で再攻撃を行う。;ただしパイロットの反応が相手を下回る場合、確率は半減。",
    mainPilotOnly: true,
  },
} as const satisfies Record<string, FeatureSpec>;
