import type { Float, Integer } from "../../BrandedTypes";
import { type FeatureSpec, FeatureTarget } from "./../types";

// ### 瀕死時に発動する特殊能力
export const FEATURES_P_04_POTENTIAL = {
  Potential: {
    name: "底力",
    target: FeatureTarget.Pilot,
    effects: [
      {
        type: "Potentiality",
        hpThreshold: 0.25 as Float,
        hitBonus: 30 as Integer,
        evasionBonus: 30 as Integer,
        criticalRateBonus: 30 as Integer,
      },
    ],
    description:
      "ＨＰが最大ＨＰの1/4以下の時に発動。;命中＆回避 +30%、クリティカル発生率 +50%。",
    mainPilotOnly: true,
  },
  SuperPotential: {
    name: "超底力",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ＨＰが最大ＨＰの1/4以下の時に発動。;命中＆回避 +50%、クリティカル発生率 +50%。",
    mainPilotOnly: true,
  },
  Resolve: {
    name: "覚悟",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ＨＰが最大ＨＰの1/4以下の時に発動。;攻撃力1.2倍、クリティカル発生率 +50%。",
    mainPilotOnly: true,
  },
  Indomitable: {
    name: "不屈",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ＨＰが最大ＨＰの1/2以下の時に発動。;損傷率に応じて防御力が増加する。",
    mainPilotOnly: true,
  },
  Comeback: {
    name: "起死回生",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ＳＰ、ＨＰ、ＥＮの全てが最大値の20%以下になると毎ターン最初に発動。;ＳＰ、ＨＰ、ＥＮが全快する。",
    mainPilotOnly: true,
  },
} as const satisfies Record<string, FeatureSpec>;
