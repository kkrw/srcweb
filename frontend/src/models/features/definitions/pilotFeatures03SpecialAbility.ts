import { type FeatureSpec, FeatureTarget } from "./../types";

// ### 特異資質に関する特殊能力
export const FEATURES_P_03_SPECIAL_ABILITY = {
  ESP: {
    name: "超感覚",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "`2×超感覚レベル＋3%`だけ命中、回避に修正が得られます。また`超感覚レベル/4`だけ思念誘導攻撃(サ)の射程が伸びます。\nレベルが正の値の場合にのみ効果が発動します。\n(SRC Ver.1.6 のＮＴに相当する能力です。)",
  },
  EnhancedPerception: {
    name: "知覚強化",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "人体改造により知覚が強化されていることを表します。\n`2×知覚強化レベル＋3%`だけ命中、回避に修正が得られます。\nまた`知覚強化レベル/4`だけ思念誘導攻撃(サ)の射程が伸びます。\nただし強化の結果精神が不安定になるため、スペシャルパワー使用時のＳＰ消費量が`20%`増加してしまいます。\nレベルが正の値の場合にのみ効果が発動します。\n(SRC Ver.1.6 の強化人間に相当する能力です。)",
  },
  Telekinesis: {
    name: "念力",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "`2×念力レベル＋3%`だけ命中、回避に修正が得られます。\nレベルが正の値の場合にのみ効果が発動します。\n(SRC Ver.1.6 の念動力に相当する能力です。)",
  },
  Aura: {
    name: "オーラ",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "オーラ技(オ)の攻撃力に`100×オーラレベル`の修正が得られます。\nユニット用特殊能力オーラ変換器を持つユニットではさらに下記の修正が加わります。\n\n| 補正対象 |      補正値 |\n| -------- | ----------: |\n| 最大ＨＰ | 100× レベル |\n| 最大ＥＮ |  10× レベル |\n| 装甲     |  50× レベル |\n| 運動性   |   2× レベル |\n\nただし修正が得られるレベルはオーラ変換器レベルまでです。\n(例 オーラ変換器のレベルが 3 なら、オーラレベルが 4 以上あっても 3 レベルとみなして修正値を計算する。)\nユニットに複数のパイロットが乗っている場合、メインパイロット以外のパイロット＆サポート(ただしそれぞれ最初の一名のみ)が持つオーラ能力レベルの 1/2 がメインパイロットのオーラレベルに加算されます。\n(SRC Ver.1.6 のオーラ力に相当する能力です。)",
  },
  Psychic: {
    name: "超能力",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "命中、回避、ＣＴ率のそれぞれに`+5%`の修正が付き、サイキック攻撃(超)の攻撃力に`100×超能力レベル`の修正が得られます。\nまた、スペシャルパワー実行時のＳＰ消費量が`通常の80%`に減少します。\nユニット用特殊能力サイキックドライブを持つユニットではさらに下記の修正が加わります。\n\n| 補正対象 |      補正値 |\n| -------- | ----------: |\n| 装甲     | 100× レベル |\n| 運動性   |   5× レベル |\n\nオーラと同様、ユニットに複数のパイロットが乗っている場合はメインパイロット以外のパイロット＆サポート(ただしそれぞれ最初の一名のみ)が持つ超能力レベルの 1/2 がメインパイロットの超能力レベルに加算されます。",
  },
  SuperReaction: {
    name: "超反応",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "レベルごとに命中、回避、ＣＴ率に対して`+2%`の修正が得られます。\n(SRC Ver.1.6 のＶ．ポジティブに相当する能力です。)",
  },
  Cyborg: {
    name: "サイボーグ",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "命中、回避のそれぞれに`+5%`の修正が付きます。",
  },
  Enlightenment: {
    name: "悟り",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "命中、回避のそれぞれに`+10%`の修正が付きます。\n(SRC Ver.1.6 の明鏡止水に相当する能力です。)",
  },
  SpiritualPower: {
    name: "霊力",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "パイロットが霊力を持つことを示します。\n実際の霊力は`霊力レベル＋1.5×パイロットレベル`として計算されます。(ただしレベルによる増加分は`100`までです)\nパイロットが特殊能力「霊力変換器」」を持つユニットに乗っている場合は下記の修正が加わります。\n\n| 補正対象 |     補正値 |\n| -------- | ---------: |\n| 最大ＨＰ |   10× 霊力 |\n| 最大ＥＮ |  0.5× 霊力 |\n| 装甲     |    5× 霊力 |\n| 移動力   | 0.01× 霊力 |\n\nなお追加パイロットの場合は第１パイロットの霊力が代わりに使われます。\n(SRC Ver.1.6 のプラーナに相当する能力です。)",
    mainPilotOnly: true,
  },
  SpiritualPowerGrowth: {
    name: "霊力成長",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "霊力の成長率が`10×霊力成長レベル%`向上します。\nつまり霊力が`霊力レベル＋1.5×パイロットレベル×(10 ＋ 霊力成長レベル)／10`で計算されるようになります。",
    mainPilotOnly: true,
  },
  SynchronizationRate: {
    name: "同調率",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "パイロットが同調率を持つことを示します。\n実際の同調率は`同調率レベル＋パイロットレベル`として計算されます。(ただしレベルによる増加分は`100`までです)\n同調率はユニット用特殊能力シンクロドライブを持つユニットに搭乗した際に下記の修正が加わります。\n\n| 補正対象                   |          補正値 |\n| -------------------------- | --------------: |\n| 運動性                     | (同調率－50)／2 |\n| 同調率対象攻撃(シ)の攻撃力 | 15×(同調率－50) |\n\n(SRC Ver.1.6 までのシンクロ率に相当する能力です。)",
    mainPilotOnly: true,
  },
  SynchronizationRateGrowth: {
    name: "同調率成長",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "同調率の成長率が`10×同調率成長レベル%`向上します。\nつまり同調率が`同調率レベル＋パイロットレベル×(10 ＋ 同調率成長レベル)／10`で計算されるようになります。",
    mainPilotOnly: true,
  },
} as const satisfies Record<string, FeatureSpec>;
