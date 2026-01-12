import { type FeatureSpec, FeatureTarget } from "../types";

// ### ユニット強化関連特殊能力
export const FEATURES_U_12_ENCHANCE = {
  HPEnhance: {
    name: "ＨＰ強化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "最大ＨＰを 200×ＨＰ強化レベル 増加。",
  },
  ENEnhance: {
    name: "ＥＮ強化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "最大ＥＮを 10×ＥＮ強化レベル 増加。",
  },
  ArmorEnhance: {
    name: "装甲強化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "装甲を 100×装甲強化レベル 増加。",
  },
  MobilityEnhance: {
    name: "運動性強化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "運動性を 5×運動性強化レベル 増加。",
  },
  MoveEnhance: {
    name: "移動力強化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "移動力を 移動力強化レベル 増加。",
  },
  HPRateEnhance: {
    name: "ＨＰ割合強化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "最大ＨＰを 5×ＨＰ割合強化レベル% 分増加。",
  },
  ENRateEnhance: {
    name: "ＥＮ割合強化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "最大ＥＮを 5×ＥＮ割合強化レベル% 分増加。",
  },
  ArmorRateEnhance: {
    name: "装甲割合強化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "装甲を 5×装甲割合強化レベル% 分増加。",
  },
  MobilityRateEnhance: {
    name: "運動性割合強化",
    target: FeatureTarget.Unit,
    effects: [],
    description: "運動性を 5×運動性割合強化レベル% 分増加。",
  },
} as const satisfies Record<string, FeatureSpec>;
