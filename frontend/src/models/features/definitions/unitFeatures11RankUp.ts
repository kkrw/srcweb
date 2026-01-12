import { type FeatureSpec, FeatureTarget } from "../types";

// ### ユニット改造関連特殊能力
export const FEATURES_U_11_RANK_UP = {
  MaxUpgrade: {
    name: "最大改造数",
    target: FeatureTarget.Unit,
    effects: [],
    description: "最大改造数を指定レベルに設定。",
    visible: false,
  },
  UpgradeCostModifier: {
    name: "改造費修正",
    target: FeatureTarget.Unit,
    effects: [],
    description: "改造費を 10×レベル% 修正。",
    visible: false,
  },
  RankUp: {
    name: "ランクアップ",
    target: FeatureTarget.Unit,
    effects: [],
    description: "ユニットランクが指定レベル以上でランクアップ。",
    visible: false,
  },
} as const satisfies Record<string, FeatureSpec>;
