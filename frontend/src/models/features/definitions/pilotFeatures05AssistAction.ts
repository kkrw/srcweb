import { type FeatureSpec, FeatureTarget } from "../types";

// ### 援護行動に関する特殊能力
export const FEATURES_P_05_ASSIST_ACTION = {
  SupportAttack: {
    name: "援護攻撃",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "隣接するユニットにサポートアタックを１ターンに 援護攻撃レベル 回行う。",
    mainPilotOnly: true,
  },
  SupportDefense: {
    name: "援護防御",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "隣接するユニットにサポートガードを１ターンに 援護防御レベル 回行う。",
    mainPilotOnly: true,
  },
  Support: {
    name: "援護",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "隣接するユニットにサポートアタックとサポートガードを１ターンにそれぞれ 援護レベル 回行う。",
    mainPilotOnly: true,
  },
  Leadership: {
    name: "統率",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "自分から攻撃をかけた場合、サポートアタックが同時援護攻撃に変更される。;（１ターンに 統率レベル 回）",
    mainPilotOnly: true,
  },
} as const satisfies Record<string, FeatureSpec>;
