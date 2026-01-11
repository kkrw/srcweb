import { type FeatureSpec, FeatureTarget } from "./../types";

// ### パイロット成長に関する特殊能力
export const FEATURES_P_07_GROWTH = {
  Prodigy: {
    name: "素質",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "入手する経験値が`50%`増加します(素質にレベル指定をした場合は`10×素質レベル%`)。\nスペシャルパワーの「獲得経験値増加」の効果とは重複しません。\nスペシャルパワー側の効果が優先されます。\n(ただし「Option」コマンドで「収得効果重複」オプションが選択されている場合は重複します)",
  },
  SlowGrowth: {
    name: "遅成長",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "入手する経験値が半減します。",
  },
  SPHighGrowth: {
    name: "ＳＰ高成長",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "レベルアップ時の最大ＳＰの増加量が`1.5倍`になります(レベル 40 まではレベル毎に 3 増加)。",
  },
  SPLowGrowth: {
    name: "ＳＰ低成長",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "レベルアップ時の最大ＳＰの増加量が`半減`します(レベル 40 まではレベル毎に 1 増加)。",
  },
  AdditionalLevel: {
    name: "追加レベル",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "パイロットの能力値をパイロットのレベルが`パイロットのレベル＋追加レベルのレベル`であるとみなして計算します。",
    visible: false,
  },
  MeleeUp: {
    name: "格闘ＵＰ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分増加させます。",
    visible: false,
  },
  RangedUp: {
    name: "射撃ＵＰ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分増加させます。",
    visible: false,
  },
  HitUp: {
    name: "命中ＵＰ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分増加させます。",
    visible: false,
  },
  EvasionUp: {
    name: "回避ＵＰ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分増加させます。",
    visible: false,
  },
  SkillUp: {
    name: "技量ＵＰ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分増加させます。",
    visible: false,
  },
  ReactionUp: {
    name: "反応ＵＰ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分増加させます。",
    visible: false,
  },
  SPUp: {
    name: "ＳＰＵＰ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分増加させます。",
    visible: false,
  },
  MeleeDown: {
    name: "格闘ＤＯＷＮ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分減少させます。",
    visible: false,
  },
  RangedDown: {
    name: "射撃ＤＯＷＮ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分減少させます。",
    visible: false,
  },
  HitDown: {
    name: "命中ＤＯＷＮ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分減少させます。",
    visible: false,
  },
  EvasionDown: {
    name: "回避ＤＯＷＮ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分減少させます。",
    visible: false,
  },
  SkillDown: {
    name: "技量ＤＯＷＮ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分減少させます。",
    visible: false,
  },
  ReactionDown: {
    name: "反応ＤＯＷＮ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分減少させます。",
    visible: false,
  },
  SPDown: {
    name: "ＳＰＤＯＷＮ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "パイロットの各能力値を指定したレベル分減少させます。",
    visible: false,
  },
} as const satisfies Record<string, FeatureSpec>;
