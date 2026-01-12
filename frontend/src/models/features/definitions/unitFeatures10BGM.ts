import { type FeatureSpec, FeatureTarget } from "../types";

// ### アイテム関連特殊能力
export const FEATURES_U_10_BGM = {
  // ### ＢＧＭ関連特殊能力
  BGM: {
    name: "ＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description: "戦闘時のＢＧＭを指定。",
    visible: false,
  },
  WeaponBGM: {
    name: "武器ＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定武器使用時のＢＧＭを指定。",
    visible: false,
  },
  AbilityBGM: {
    name: "アビリティＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description: "指定アビリティ使用時のＢＧＭを指定。",
    visible: false,
  },
  CombineBGM: {
    name: "合体ＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description: "合体時のＢＧＭを指定。",
    visible: false,
  },
  SeparateBGM: {
    name: "分離ＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description: "分離時のＢＧＭを指定。",
    visible: false,
  },
  TransformBGM: {
    name: "変形ＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description: "変形時のＢＧＭを指定。",
    visible: false,
  },
  HyperModeBGM: {
    name: "ハイパーモードＢＧＭ",
    target: FeatureTarget.Unit,
    effects: [],
    description: "ハイパーモード発動時のＢＧＭを指定。",
    visible: false,
  },
} as const satisfies Record<string, FeatureSpec>;
