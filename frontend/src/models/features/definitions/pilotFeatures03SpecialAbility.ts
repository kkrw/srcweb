import { type FeatureSpec, FeatureTarget } from "./../types";

// ### 特異資質に関する特殊能力
export const FEATURES_P_03_SPECIAL_ABILITY = {
  ESP: {
    name: "超感覚",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "命中・回避に +2×超感覚レベル+3 の修正を与える。;思念誘導攻撃(サ)の射程を 超感覚レベル/4 だけ延長する。",
  },
  EnhancedPerception: {
    name: "知覚強化",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "命中・回避に +2×知覚強化レベル+3 の修正を与える。;思念誘導攻撃(サ)の射程を 知覚強化レベル/4 だけ延長する。;精神不安定によりＳＰ消費量が20%増加する。",
  },
  Telekinesis: {
    name: "念力",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "命中・回避に +2×念力レベル+3 の修正を与える。",
  },
  Aura: {
    name: "オーラ",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "オーラ技「オ」の攻撃力の強度に 100×オーラレベル の修正を与える。;また、ＨＰ、ＥＮ、装甲、運動性がレベルに合わせてそれぞれ増加する。",
  },
  Psychic: {
    name: "超能力",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "命中・回避・ＣＴ率にそれぞれ +5。;サイキック攻撃(超)の攻撃力に +100×超能力レベル。;ＳＰ消費量を20%削減する。",
  },
  SuperReaction: {
    name: "超反応",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "命中・回避・ＣＴ率にそれぞれ +2×超反応レベル の修正を与える。",
  },
  Cyborg: {
    name: "サイボーグ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "命中・回避に +5 の修正を与える。",
  },
  Enlightenment: {
    name: "悟り",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "命中・回避に +10 の修正を与える。",
  },
  SpiritualPower: {
    name: "霊力",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "現在の霊力値にあわせてＨＰ・ＥＮ・装甲・移動力を強化する。",
    mainPilotOnly: true,
  },
  SpiritualPowerGrowth: {
    name: "霊力成長",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "霊力の成長率が 10×霊力成長レベル% 増加する。",
    mainPilotOnly: true,
  },
  SynchronizationRate: {
    name: "同調率",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "機体に同調し運動性・攻撃力を強化する。",
    mainPilotOnly: true,
  },
  SynchronizationRateGrowth: {
    name: "同調率成長",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "同調率の成長率が 10×同調率成長レベル% 増加する。",
    mainPilotOnly: true,
  },
} as const satisfies Record<string, FeatureSpec>;
