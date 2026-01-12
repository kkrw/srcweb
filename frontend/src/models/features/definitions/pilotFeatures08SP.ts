import { type FeatureSpec, FeatureTarget } from "./../types";

// ### パイロット成長に関する特殊能力
export const FEATURES_P_08_SPECIAL_POWER = {
  // ### スペシャルパワーに関する特殊能力
  Concentration: {
    name: "集中力",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "スペシャルパワーのＳＰ消費量が元の80%に減少する。",
    mainPilotOnly: true,
  },
  SPRecovery: {
    name: "ＳＰ回復",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "毎ターンＳＰがパイロットレベル/8+5回復する。",
  },
  MentalFocus: {
    name: "精神統一",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ＳＰが最大ＳＰの20%未満の場合、ターン開始時にＳＰが最大ＳＰの10%分回復する。",
  },
  SPCostReduction: {
    name: "ＳＰ消費減少",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "指定したスペシャルパワーのＳＰ消費量が 10×ＳＰ消費減少レベル% 減少する。",
  },
  AutoActivateSP: {
    name: "スペシャルパワー自動発動",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "気力が指定値以上で発動し、毎ターン最初に指定したスペシャルパワーが自動でかかる。;（ＳＰは消費しない）",
  },
} as const satisfies Record<string, FeatureSpec>;
