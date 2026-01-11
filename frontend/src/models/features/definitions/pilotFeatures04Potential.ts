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
      "ユニットの HP が 1/4 以下のとき、命中・回避率・クリティカル率が 30% 上昇します。",
    mainPilotOnly: true,
  },
  SuperPotential: {
    name: "超底力",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ユニットのＨＰが最大ＨＰの`1/4`以下のときに発動します。\n命中率と回避率が`50%`アップするとともに、クリティカル発生率が`50%`アップします。",
    mainPilotOnly: true,
  },
  Resolve: {
    name: "覚悟",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ユニットのＨＰが最大ＨＰの`1/4`以下のときに発動します。\nダメージ計算時に攻撃力が`1.2倍`になるとともに、クリティカル発生率が`50%`アップします。\n底力(超底力)と異なり、命中率＆回避率アップの効果はありません。",
    mainPilotOnly: true,
  },
  Indomitable: {
    name: "不屈",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ユニットのＨＰが最大ＨＰの`1/2`以下のときに発動し、損傷率に応じてダメージ計算における装甲値がアップします。\n\n|    損傷率 | ダメージ計算における装甲値 |\n| --------: | -------------------------: |\n|   50%以上 |                     1.1 倍 |\n|   75%以上 |                     1.2 倍 |\n| 87.5%以上 |                     1.3 倍 |",
    mainPilotOnly: true,
  },
  Comeback: {
    name: "起死回生",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ＨＰ、ＥＮ、ＳＰの全てが最大値の`20%`以下になると毎ターン最初に発動し、ＨＰ、ＥＮ、ＳＰが全快します。",
    mainPilotOnly: true,
  },
} as const satisfies Record<string, FeatureSpec>;
