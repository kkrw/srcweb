import { type FeatureSpec, FeatureTarget } from "./../types";

// ### その他の特殊能力
export const FEATURES_P_99_OTHER = {
  MoneyGain: {
    name: "資金獲得",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "この能力を持つパイロットが敵を倒した場合、通常の 1.5 倍の資金が手に入ります。",
  },
  Art: {
    name: "術",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "術を使うために必要な能力です。",
  },
  Technique: {
    name: "技",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "技を使うために必要な能力です。",
  },
  HasMagic: {
    name: "魔力所有",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "魔力を持つことを示します。",
  },
  Hero: {
    name: "英雄",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "英雄的な活躍をしたパイロットに与えられる能力です。命中、回避、ＣＴ率がそれぞれ 10%上昇します。",
  },
  Regeneration: {
    name: "再生",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "毎ターンＨＰが 10%回復します。",
  },
  DoubleAction: {
    name: "２回行動",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "気力 120 以上で１ターンに２回行動できるようになります。",
  },
  Tactics: {
    name: "戦術",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "戦術的な指示を出す能力です。",
  },
  Message: {
    name: "メッセージ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "特定の状況でメッセージを表示します。",
  },
  RepairSkill: {
    name: "修理",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "修理装置を持つユニットに搭乗している場合、修理時の回復量がアップします。",
  },
  ResupplySkill: {
    name: "補給",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "補給装置を持つユニットに搭乗している場合、補給時の気力低下を抑えます。",
  },
  Team: {
    name: "チーム",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "特定のチームに所属していることを示します。",
  },
} as const satisfies Record<string, FeatureSpec>;
