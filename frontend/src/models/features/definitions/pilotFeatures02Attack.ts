import { type FeatureSpec, FeatureTarget } from "./../types";

// ### 攻撃に関する特殊能力
export const FEATURES_P_02_ATTACK = {
  UnleashPotential: {
    name: "潜在力開放",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "気力 130 以上で発動し、攻撃時に与えるダメージを 25%増加します。\n(SRC Ver.1.6 の野生化に相当する能力です。)",
    mainPilotOnly: true,
  },
  Forte: {
    name: "得意技",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "書式 `得意技=属性`\n指定した属性を持つ武器によるダメージが 20%増加します。アビリティの場合は効果量(回復アビリティによるＨＰ回復量など)が 20%増加し、継続時間(付加アビリティの継続ターン数)が 40%増加します。\n属性は複数指定可能です。属性同士をそのまま繋げて指定して下さい。\n本能力は別名指定を行うことが出来ません。\n例 `得意技=風雷`",
    mainPilotOnly: true,
  },
  Weakness: {
    name: "不得手",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "書式 `不得手=属性`\n指定した属性を持つ武器によるダメージが 20%減少します。アビリティの場合は効果量が 20%増加し、継続時間が 40%減少します(最低でも 1 ターンは継続)。\n属性は複数指定可能です。属性同士をそのまま繋げて指定して下さい。\n本能力は別名指定を行うことが出来ません。\n例 `不得手=水`",
    mainPilotOnly: true,
  },
  Hunter: {
    name: "ハンター",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "書式 `ハンターLv*=別名 ターゲット１ ターゲット２ ……`\n指定したターゲットに攻撃する際に、ターゲットに与えるダメージがハンターレベル ×10%増加します。ターゲットはユニット名称、ユニットクラス、ユニットのサイズ(「S サイズ」のように「サイズ」を付けて指定)、パイロット名称、パイロットの性別のいずれかで指定します。\nユニットクラスで指定した場合、指定したクラスに該当するかどうかを判定する際に専用指定や人間ユニット指定が無視されます。\n例 `ハンターLv3=ヴァンパイアハンター ヴァンパイア`",
    mainPilotOnly: true,
  },
  Counter: {
    name: "カウンター",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "１ターンにレベル回数だけ、攻撃を受けた際の反撃がカウンター攻撃になります。カウンター攻撃による反撃は通常の反撃と異なり、相手の攻撃の前に発動します。",
    mainPilotOnly: true,
  },
  Premonition: {
    name: "先読み",
    target: FeatureTarget.Pilot,
    effects: [],
    description: "先読みレベル/16 の確率で反撃がカウンター攻撃になります。",
    mainPilotOnly: true,
  },
  PreemptiveStrike: {
    name: "先手必勝",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "書式 `先手必勝[=別名 必要気力]`\nパイロットの気力が指定した気力以上に達すると反撃が必ずカウンター攻撃になります。気力指定を省略した場合は気力が 120 以上で能力が発動します。",
    mainPilotOnly: true,
  },
  ReAttack: {
    name: "再攻撃",
    target: FeatureTarget.Pilot,
    effects: [],
    description:
      "自分の攻撃が終わった直後に `再攻撃レベル/16` の確率で再攻撃を行います。\nただし、相手の反応値が自分の反応値を上回っている場合は確率が半減します。\nまた、使用した武器がマップ攻撃もしくは合体技である場合は発動しません。\nサポートアタック.2.N_U の際にも発動しません。\n武器属性「再」による再攻撃とは別に判定が行われますが、発動する再攻撃の回数は合計で１回のみです。\n持続期間が「攻撃」であるスペシャルパワーは最初の攻撃にのみ有効です。",
    mainPilotOnly: true,
  },
} as const satisfies Record<string, FeatureSpec>;
