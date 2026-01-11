import { type FeatureSpec, FeatureTarget } from "./../types";

// ### パイロット成長に関する特殊能力
export const FEATURES_P_09_MORALE = {
  // ### 気力に関する特殊能力
  FightingSpirit: {
    name: "闘争本能",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "「出撃時の気力」が `5×闘争本能レベル` 増加します。\nレベル指定は省略することが出来ます。\nこの場合は気力増加は 5 となり、出撃時の初期気力は 105 になります。",
    mainPilotOnly: true,
  },
  MoraleGainOnDamage: {
    name: "損傷時気力増加",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ダメージを受けた際の気力増加量が指定したレベルだけ増加します。",
    mainPilotOnly: true,
  },
  MoraleGainOnHit: {
    name: "命中時気力増加",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "攻撃を命中させた際に気力が指定したレベルだけ増加します。\nただしマップ攻撃による攻撃は例外となります。",
    mainPilotOnly: true,
  },
  MoraleGainOnMiss: {
    name: "失敗時気力増加",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "攻撃を外してしまった際に気力が指定したレベルだけ増加します。\nただしマップ攻撃による攻撃は例外となります。",
    mainPilotOnly: true,
  },
  MoraleGainOnEvasion: {
    name: "回避時気力増加",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "攻撃を回避した際に気力が指定したレベルだけ増加します。",
    mainPilotOnly: true,
  },
  MoraleLimit: {
    name: "気力上限",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "「気力」の上限が指定したレベルになります。\n追加パイロットの場合、追加パイロットと通常のパイロットの気力はリンクさせる必要があるため、両方のパイロットに本能力を持たせてください。",
    mainPilotOnly: true,
  },
  MoraleMin: {
    name: "気力下限",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "「気力」の下限が指定したレベルになります。\n追加パイロットの場合、追加パイロットと通常のパイロットの気力はリンクさせる必要があるため、両方のパイロットに本能力を持たせてください。",
    mainPilotOnly: true,
  },
} as const satisfies Record<string, FeatureSpec>;
