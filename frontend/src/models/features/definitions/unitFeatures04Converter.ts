import type { Float } from "../../BrandedTypes";
import { type FeatureSpec, FeatureTarget } from "./../types";

// ### コンバータ系特殊能力
export const FEATURES_U_04_CONVERTER = {
  SpiritConverter: {
    name: "霊力変換器",
    target: FeatureTarget.Unit,
    effects: [
      {
        type: "ForceConverter",
        conversionSpec: [
          {
            target: "hp",
            sourceFeatureName: "霊力",
            unit: 1 as Float,
            rate: 10 as Float,
          },
          {
            target: "en",
            sourceFeatureName: "霊力",
            unit: 1 as Float,
            rate: 0.5 as Float,
          },
          {
            target: "armor",
            sourceFeatureName: "霊力",
            unit: 1 as Float,
            rate: 50 as Float,
          },
          {
            target: "mobility",
            sourceFeatureName: "霊力",
            unit: 1 as Float,
            rate: 2 as Float,
          },
        ],
      },
    ],
    description: "霊力に合わせて各種能力が上昇する。",
  },
  AuraConverter: {
    name: "オーラ変換器",
    target: FeatureTarget.Unit,
    effects: [],
    description: "オーラレベルに合わせて各種能力が上昇する。",
  },
  PsychicDrive: {
    name: "サイキックドライブ",
    target: FeatureTarget.Unit,
    effects: [],
    description: "超能力レベルごとに装甲+100、運動性+5。",
  },
  SynchroDrive: {
    name: "シンクロドライブ",
    target: FeatureTarget.Unit,
    effects: [],
    description: "同調率に合わせて各種能力が上昇する。",
  },
  Boost: {
    name: "ブースト",
    target: FeatureTarget.Unit,
    effects: [],
    description: "気力130以上で発動し、ダメージを25%アップ。",
  },
} as const satisfies Record<string, FeatureSpec>;
