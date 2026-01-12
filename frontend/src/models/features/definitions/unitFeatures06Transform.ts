import { type FeatureSpec, FeatureTarget } from "../types";

// ### 変形系特殊能力
export const FEATURES_U_06_TRANSFORM = {
  Transform: {
    name: "変形",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した形態に変形。",
  },
  Remodel: {
    name: "換装",
    target: FeatureTarget.Unit,
    effects: [],
    description: "インターミッションでのみ可能な変形。",
    visible: false,
  },
  PartsSeparation: {
    name: "パーツ分離",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "ＨＰが０になると 10×パーツ分離レベル% の確率で指定形態に変化。;（レベル省略時は100%）",
  },
  PartsCombination: {
    name: "パーツ合体",
    target: FeatureTarget.Unit,
    effects: [],
    description: "インターミッション開始時に指定形態に自動変形。",
    visible: false,
  },
  HyperMode: {
    name: "ハイパーモード",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "気力が 100+10×ハイパーモードレベル 以上またはＨＰが最大ＨＰの1/4以下の時に指定形態に変形可能。",
  },
  NormalMode: {
    name: "ノーマルモード",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "ハイパーモードの変形先に指定する能力。;残り時間経過後に指定形態へ強制変形。",
    visible: false,
  },
  Combine: {
    name: "合体",
    target: FeatureTarget.Unit,
    effects: [],
    description: "パートナーと合体して指定形態に変形。",
  },
  Separate: {
    name: "分離",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定した複数のユニットに分離。",
  },
  CombineRestriction: {
    name: "合体制限",
    target: FeatureTarget.Unit,
    effects: [],
    description: "合体能力で指定された形態でないと合体不可。",
    visible: false,
  },
  MainForm: {
    name: "主形態",
    target: FeatureTarget.Unit,
    effects: [],
    description: "２体合体時にインターミッションで自動分離しない。",
    visible: false,
  },
  OtherForms: {
    name: "他形態",
    target: FeatureTarget.Unit,
    effects: [],
    description: "直接移行できない他の形態を指定。",
    visible: false,
  },
  TimeLimit: {
    name: "制限時間",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定ターン後に自動分離または消滅。",
    visible: false,
  },
} as const satisfies Record<string, FeatureSpec>;
