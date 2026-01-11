import { type FeatureSpec, FeatureTarget } from "./../types";

// ### パイロット成長に関する特殊能力
export const FEATURES_P_08_SPECIAL_POWER = {
  // ### スペシャルパワーに関する特殊能力
  Concentration: {
    name: "集中力",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ＳＰ消費量が通常の`80%`になります。\n超能力によるＳＰ消費量低下とは重複しません。",
    mainPilotOnly: true,
  },
  SPRecovery: {
    name: "ＳＰ回復",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ターン開始時にパイロットのＳＰがパイロットレベル/8+5 回復します。",
  },
  MentalFocus: {
    name: "精神統一",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "ＳＰが最大ＳＰの`20%`未満の場合、ターン開始時にＳＰが最大ＳＰの 10%分回復します。",
  },
  SPCostReduction: {
    name: "ＳＰ消費減少",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "書式 `ＳＰ消費減少Lv*=別名 スペシャルパワー名称`\n例 `ＳＰ消費減少Lv2=純粋な心 信頼 友情 愛`\n指定したスペシャルパワーのＳＰ消費量を `10×ＳＰ消費減少レベル%` 減少させます。\nスペシャルパワーは複数指定可能です。",
  },
  AutoActivateSP: {
    name: "スペシャルパワー自動発動",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "書式 `スペシャルパワー自動発動=別名 スペシャルパワー名称 必要気力`\n例 `スペシャルパワー自動発動=未来予知 ひらめき 120`\nパイロットの気力が指定した気力に達すると指定したスペシャルパワーが各ターンの自軍フェイズ開始時に自動発動します。\nただし、指定出来るスペシャルパワーは対象を指定する必要が無いものに限られます(対象が「自分」「全」「全味方」「全敵」のいずれか)。\nなお、スペシャルパワーが発動した際にＳＰは消費されません。",
  },
} as const satisfies Record<string, FeatureSpec>;
