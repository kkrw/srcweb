import { type FeatureSpec, FeatureTarget } from "../types";

// ### ユニット強化関連特殊能力
export const FEATURES_U_12_ENCHANCE = {
  HPEnhance: {
    name: "ＨＰ強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ＨＰ強化Lv*[=別名 必要気力]`\nユニットの最大ＨＰが`200×レベル`増加します。",
  },
  ENEnhance: {
    name: "ＥＮ強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ＥＮ強化Lv*[=別名 必要気力]`\nユニットの最大ＥＮが`10×レベル`増加します。",
  },
  ArmorEnhance: {
    name: "装甲強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `装甲強化Lv*[=別名 必要気力]`\nユニットの装甲が`100×レベル`増加します。",
  },
  MobilityEnhance: {
    name: "運動性強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `運動性強化Lv*[=別名 必要気力]`\nユニットの運動性が`5×レベル`増加します。",
  },
  MoveEnhance: {
    name: "移動力強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `移動力強化Lv*[=別名 必要気力]`\nユニットの移動力がレベル増加します。",
  },
  HPRateEnhance: {
    name: "ＨＰ割合強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ＨＰ割合強化Lv*[=別名 必要気力]`\nユニットの最大ＨＰがユニットデータの`最大ＨＰ×レベル／20`増加します。",
  },
  ENRateEnhance: {
    name: "ＥＮ割合強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ＥＮ割合強化Lv*[=別名 必要気力]`\nユニットの最大ＥＮがユニットデータの`最大ＥＮ×レベル／20`増加します。",
  },
  ArmorRateEnhance: {
    name: "装甲割合強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `装甲割合強化Lv*[=別名 必要気力]`\nユニットの装甲がユニットデータの`装甲×レベル／20`増加します。",
  },
  MobilityRateEnhance: {
    name: "運動性割合強化",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `運動性割合Lv*[=別名 必要気力]`\nユニットの運動性がユニットデータの`運動性×レベル／20`増加します。",
  },
} as const satisfies Record<string, FeatureSpec>;
