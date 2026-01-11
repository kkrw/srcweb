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
    description:
      "霊力 Lv に応じてユニットの最大ＨＰ、最大ＥＮ、装甲、運動性が上昇します。",
  },
  AuraConverter: {
    name: "オーラ変換器",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `オーラ変換器Lv*[=別名]`\nパイロット用特殊能力オーラによる各種修正を有効にします。\n最大ＨＰが`100×レベル`、最大ＥＮが`10×レベル`\n装甲が`50×レベル`、運動性が`2×レベル`\nそれぞれ上昇します。ただし修正に使われるオーラレベルの上限はオーラ変換器のレベルまでです。レベル指定がない場合はオーラのレベルに応じて無制限に修正が行われます。\n(SRC Ver.1.6 のオーラコンバータに相当する能力です。)",
  },
  PsychicDrive: {
    name: "サイキックドライブ",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `サイキックドライブLv*[=別名]`\nパイロット用特殊能力超能力による各種修正を有効にします。\n超能力レベルごとに装甲が`+100`、運動性が`+5`されます。\nサイキックドライブにレベル指定がなされている場合、修正に使われる超能力レベルの上限はサイキックドライブのレベルまでに限定されます。\nレベル指定がない場合は超能力に応じて無制限に修正が行われます。",
  },
  SynchroDrive: {
    name: "シンクロドライブ",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `シンクロドライブLv*[=別名]`\nパイロット用特殊能力同調率による運動性修正を有効にします。\n`(同調率－50)／2`だけ運動性が上昇します。\nシンクロドライブにレベル指定がなされている場合、修正に使われる同調率の上限はシンクロドライブのレベルまでに限定されます。\nレベル指定がない場合は同調率に応じて無制限に修正が行われます。",
  },
  Boost: {
    name: "ブースト",
    target: FeatureTarget.Unit,
    effects: [],
    description:
      "書式 `ブースト[=別名]`\n気力`130`以上で発動し、攻撃時に与えるダメージを`25%`上昇させます。",
  },
} as const satisfies Record<string, FeatureSpec>;
